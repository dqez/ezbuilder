// Craft.js Resolver - Maps component names to React components
// This file exports a resolver object that Craft.js uses to serialize/deserialize the editor state

export { NodeText } from "./NodeText";
export { NodeHeading } from "./NodeHeading";
export { NodeImage } from "./NodeImage";
export { NodeButton } from "./NodeButton";
export { NodeContainer } from "./NodeContainer";
export { NodeSpacer } from "./NodeSpacer";
export { NodeDivider } from "./NodeDivider";
export { NodeCard } from "./NodeCard";
export { NodeHero } from "./NodeHero";
export { NodeNavbar } from "./NodeNavbar";
export { NodeFooter } from "./NodeFooter";
export { NodeGallery } from "./NodeGallery";

// Resolver for Craft.js Editor
import { NodeText } from "./NodeText";
import { NodeHeading } from "./NodeHeading";
import { NodeImage } from "./NodeImage";
import { NodeButton } from "./NodeButton";
import { NodeContainer } from "./NodeContainer";
import { NodeSpacer } from "./NodeSpacer";
import { NodeDivider } from "./NodeDivider";
import { NodeCard } from "./NodeCard";
import { NodeHero } from "./NodeHero";
import { NodeNavbar } from "./NodeNavbar";
import { NodeFooter } from "./NodeFooter";
import { NodeGallery } from "./NodeGallery";

export const resolver = {
  Text: NodeText,
  Heading: NodeHeading,
  Image: NodeImage,
  Button: NodeButton,
  Container: NodeContainer,
  Spacer: NodeSpacer,
  Divider: NodeDivider,
  Card: NodeCard,
  Hero: NodeHero,
  Navbar: NodeNavbar,
  Footer: NodeFooter,
  Gallery: NodeGallery,
};
