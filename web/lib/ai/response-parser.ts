/**
 * EzBuilderResponseParser
 * Extracts <ezAction> tags from streaming AI responses
 */

export interface EzAction {
  type: "add" | "update" | "delete" | "move" | "replace_all";
  nodeId: string;
  data: {
    component?: string;
    props?: Record<string, unknown>;
    newParentId?: string;
    index?: number;
    components?: Array<{ component: string; props: Record<string, unknown> }>;
  };
}

export class EzBuilderResponseParser {
  private buffer: string = "";
  private actions: EzAction[] = [];
  private processedActionIndices: Set<number> = new Set();

  /**
   * Parse a chunk of streaming text
   */
  parseChunk(chunk: string): void {
    this.buffer += chunk;
  }

  /**
   * Extract all <ezAction> tags from the buffer
   * Returns newly discovered actions (not previously extracted)
   */
  extractActions(): EzAction[] {
    const actionRegex =
      /<ezAction\s+type="([^"]+)"\s+nodeId="([^"]+)">([^<]*)<\/ezAction>/g;
    const newActions: EzAction[] = [];
    let match;
    let currentIndex = 0;

    while ((match = actionRegex.exec(this.buffer)) !== null) {
      // Skip if already processed
      if (this.processedActionIndices.has(currentIndex)) {
        currentIndex++;
        continue;
      }

      try {
        const type = match[1] as EzAction["type"];
        const nodeId = match[2];
        const jsonContent = match[3].trim();

        // Parse JSON data
        const data = JSON.parse(jsonContent);

        const action: EzAction = {
          type,
          nodeId,
          data,
        };

        this.actions.push(action);
        newActions.push(action);
        this.processedActionIndices.add(currentIndex);
      } catch (error) {
        console.error("Failed to parse ezAction:", error, match[0]);
      }

      currentIndex++;
    }

    return newActions;
  }

  /**
   * Get text content without <ezAction> tags (for display)
   */
  getCleanText(): string {
    return this.buffer.replace(
      /<ezAction\s+type="[^"]+"\s+nodeId="[^"]+">.*?<\/ezAction>/g,
      "",
    );
  }

  /**
   * Get all actions extracted so far
   */
  getAllActions(): EzAction[] {
    return this.actions;
  }

  /**
   * Get the raw buffer (for debugging)
   */
  getBuffer(): string {
    return this.buffer;
  }

  /**
   * Reset the parser state
   */
  reset(): void {
    this.buffer = "";
    this.actions = [];
    this.processedActionIndices.clear();
  }
}
