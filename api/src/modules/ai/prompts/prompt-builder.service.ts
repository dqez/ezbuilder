import { Injectable } from '@nestjs/common';
import SYSTEM_PROMPT from './system-prompt';

export interface CanvasState {
  [nodeId: string]: {
    type: { resolvedName: string };
    isCanvas?: boolean;
    props: Record<string, unknown>;
    displayName?: string;
    custom?: Record<string, unknown>;
    parent?: string;
    hidden?: boolean;
    nodes?: string[];
    linkedNodes?: Record<string, string>;
  };
}

@Injectable()
export class PromptBuilderService {
  /**
   * Build the static system prompt
   */
  buildSystemPrompt(): string {
    return SYSTEM_PROMPT;
  }

  /**
   * Build dynamic user context from canvas state and selected node
   */
  buildUserContext(params: {
    canvasState?: CanvasState;
    selectedNode?: string;
  }): string {
    const contextParts: string[] = [];

    // Add canvas state if provided
    if (params.canvasState) {
      const simplified = this.simplifyCanvasState(params.canvasState);
      contextParts.push('## Current Canvas State\n');
      contextParts.push('```json');
      contextParts.push(JSON.stringify(simplified, null, 2));
      contextParts.push('```\n');
    }

    // Add selected node if provided
    if (params.selectedNode && params.canvasState) {
      const selectedData = params.canvasState[params.selectedNode];
      if (selectedData) {
        contextParts.push('## Currently Selected Node\n');
        contextParts.push(`- ID: ${params.selectedNode}`);
        contextParts.push(
          `- Component: ${selectedData.type.resolvedName || 'Unknown'}`,
        );
        contextParts.push(
          `- Props: ${JSON.stringify(selectedData.props, null, 2)}`,
        );
        contextParts.push('');
      }
    }

    return contextParts.length > 0 ? contextParts.join('\n') : '';
  }

  /**
   * Simplify canvas state to reduce token count
   * Only include structure (component types, hierarchy) without full prop details
   */
  private simplifyCanvasState(canvasState: CanvasState): unknown {
    const simplified: Record<string, unknown> = {};

    for (const [nodeId, nodeData] of Object.entries(canvasState)) {
      // Skip if not valid node data
      if (!nodeData || typeof nodeData !== 'object') continue;

      simplified[nodeId] = {
        component: nodeData.type?.resolvedName || 'Unknown',
        parent: nodeData.parent || null,
        children: nodeData.nodes || [],
        // Only include key props (omit verbose or binary data)
        keyProps: this.extractKeyProps(nodeData.props),
      };
    }

    return simplified;
  }

  /**
   * Extract only important props, ignore verbose/binary data
   */
  private extractKeyProps(
    props: Record<string, unknown>,
  ): Record<string, unknown> {
    const keyProps: Record<string, unknown> = {};
    const importantKeys = [
      'text',
      'title',
      'subtitle',
      'heading',
      'backgroundColor',
      'color',
      'variant',
      'layout',
      'columns',
      'padding',
      'gap',
      'flexDirection',
      // Add more as needed
    ];

    for (const key of importantKeys) {
      if (key in props && props[key] !== undefined) {
        keyProps[key] = props[key];
      }
    }

    return keyProps;
  }

  /**
   * Truncate canvas state if too large (> 50 nodes)
   * Keep ROOT and first level children only
   */
  truncateCanvasState(canvasState: CanvasState): CanvasState {
    const nodeCount = Object.keys(canvasState).length;

    if (nodeCount <= 50) {
      return canvasState;
    }

    // Keep ROOT and immediate children
    const truncated: CanvasState = {};
    const root = canvasState.ROOT;

    if (root) {
      truncated.ROOT = root;

      // Add immediate children of ROOT
      if (root.nodes && Array.isArray(root.nodes)) {
        for (const childId of root.nodes) {
          if (canvasState[childId]) {
            truncated[childId] = canvasState[childId];
          }
        }
      }
    }

    return truncated;
  }
}
