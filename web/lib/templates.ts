export interface Template {
  id: string;
  name: string;
  description: string;
  category: "blank" | "portfolio" | "business" | "blog" | "ecommerce" | "event";
  thumbnail?: string;
  /** Hệ màu để render SVG thumbnail preview */
  colors: {
    primary: string; // Hero/header bg
    secondary: string; // Accent section
    text: string; // Main text color
    bg: string; // Page background
  };
  data: Record<string, unknown>;
}

// Helper to create a basic text node
const createTextNode = (id: string, text: string, parent: string = "ROOT") => ({
  type: { resolvedName: "Text" },
  isCanvas: false,
  props: { text, fontSize: "16px", textAlign: "left" },
  parent,
  displayName: "Text",
  hidden: false,
  nodes: [],
  linkedNodes: {},
});

// Helper to create a heading node
const createHeadingNode = (
  id: string,
  text: string,
  level: "h1" | "h2" | "h3" = "h2",
  parent: string = "ROOT",
) => ({
  type: { resolvedName: "Heading" },
  isCanvas: false,
  props: {
    text,
    level: level === "h1" ? 1 : level === "h2" ? 2 : 3,
    textAlign: "left",
  },
  parent,
  displayName: "Heading",
  hidden: false,
  nodes: [],
  linkedNodes: {},
});

// Helper to create a container node
const createContainerNode = (
  id: string,
  nodes: string[] = [],
  parent: string = "ROOT",
  props: Record<string, unknown> = {},
) => ({
  type: { resolvedName: "Container" },
  isCanvas: true,
  props: {
    padding: 20,
    backgroundColor: "transparent",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
    ...props,
  },
  parent,
  displayName: "Container",
  hidden: false,
  nodes,
  linkedNodes: {},
});

// Basic empty ROOT node
const BASE_ROOT = {
  type: { resolvedName: "Container" },
  isCanvas: true,
  props: {
    padding: 24,
    backgroundColor: "#ffffff",
    flexDirection: "column",
    gap: 16,
  },
  displayName: "App",
  custom: { displayName: "App" },
  hidden: false,
  nodes: [],
  linkedNodes: {},
};

export const TEMPLATES: Template[] = [
  {
    id: "blank",
    name: "Trang Trắng",
    description: "Bắt đầu với một trang trắng hoàn toàn.",
    category: "blank",
    colors: {
      primary: "#e5e7eb",
      secondary: "#f9fafb",
      text: "#6b7280",
      bg: "#ffffff",
    },
    data: {
      ROOT: BASE_ROOT,
    },
  },
  {
    id: "portfolio",
    name: "Portfolio Cá Nhân",
    description:
      "Mẫu portfolio chuyên nghiệp để giới thiệu bản thân và các dự án.",
    thumbnail: "/templates/portfolio.png",
    category: "portfolio",
    colors: {
      primary: "#111827",
      secondary: "#f3f4f6",
      text: "#ffffff",
      bg: "#ffffff",
    },
    data: {
      ROOT: {
        ...BASE_ROOT,
        nodes: ["hero-section", "projects-section", "contact-section"],
      },
      "hero-section": createContainerNode(
        "hero-section",
        ["hero-title", "hero-subtitle"],
        "ROOT",
        {
          backgroundColor: "#f3f4f6",
          padding: 60,
          alignItems: "center",
          gap: 20,
        },
      ),
      "hero-title": createHeadingNode(
        "hero-title",
        "Xin chào, tôi là [Tên Của Bạn]",
        "h1",
        "hero-section",
      ),
      "hero-subtitle": createTextNode(
        "hero-subtitle",
        "Tôi là một lập trình viên / nhà thiết kế đầy nhiệt huyết.",
        "hero-section",
      ),
      "projects-section": createContainerNode(
        "projects-section",
        ["projects-title"],
        "ROOT",
        { padding: 40 },
      ),
      "projects-title": createHeadingNode(
        "projects-title",
        "Dự Án Tiêu Biểu",
        "h2",
        "projects-section",
      ),
      "contact-section": createContainerNode(
        "contact-section",
        ["contact-title", "contact-text"],
        "ROOT",
        { backgroundColor: "#111827", padding: 60, alignItems: "center" },
      ),
      "contact-title": {
        ...createHeadingNode(
          "contact-title",
          "Liên Hệ",
          "h2",
          "contact-section",
        ),
        props: {
          text: "Liên Hệ",
          level: "h2",
          textAlign: "center",
          color: "#ffffff",
        },
      },
      "contact-text": {
        ...createTextNode(
          "contact-text",
          "email@example.com",
          "contact-section",
        ),
        props: { text: "email@example.com", color: "#d1d5db" },
      },
    },
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description: "Trang đích hoàn hảo để giới thiệu sản phẩm hoặc dịch vụ mới.",
    category: "business",
    colors: {
      primary: "#2563eb",
      secondary: "#f9fafb",
      text: "#ffffff",
      bg: "#ffffff",
    },
    data: {
      ROOT: {
        ...BASE_ROOT,
        nodes: ["header", "features", "cta"],
      },
      header: createContainerNode(
        "header",
        ["header-title", "header-desc"],
        "ROOT",
        {
          backgroundColor: "#2563eb",
          padding: 80,
          alignItems: "center",
        },
      ),
      "header-title": {
        ...createHeadingNode(
          "header-title",
          "Sản Phẩm Đột Phá",
          "h1",
          "header",
        ),
        props: { text: "Sản Phẩm Đột Phá", level: "h1", color: "#ffffff" },
      },
      "header-desc": {
        ...createTextNode(
          "header-desc",
          "Giải pháp tối ưu cho doanh nghiệp của bạn.",
          "header",
        ),
        props: {
          text: "Giải pháp tối ưu cho doanh nghiệp của bạn.",
          color: "#e0e7ff",
          fontSize: "18px",
        },
      },
      features: createContainerNode("features", ["features-title"], "ROOT", {
        padding: 60,
        gap: 40,
      }),
      "features-title": createHeadingNode(
        "features-title",
        "Tính Năng Nổi Bật",
        "h2",
        "features",
      ),
      cta: createContainerNode("cta", ["cta-title"], "ROOT", {
        backgroundColor: "#f9fafb",
        padding: 60,
        alignItems: "center",
      }),
      "cta-title": createHeadingNode(
        "cta-title",
        "Bắt Đầu Ngay Hôm Nay",
        "h2",
        "cta",
      ),
    },
  },
  {
    id: "business",
    name: "Doanh Nghiệp",
    description: "Trang web chuyên nghiệp dành cho công ty và tổ chức.",
    category: "business",
    colors: {
      primary: "#1e40af",
      secondary: "#f3f4f6",
      text: "#ffffff",
      bg: "#ffffff",
    },
    data: {
      ROOT: {
        ...BASE_ROOT,
        nodes: ["biz-hero", "biz-services", "biz-about"],
      },
      "biz-hero": createContainerNode("biz-hero", ["biz-hero-title"], "ROOT", {
        height: "400px",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')",
        justifyContent: "center",
        alignItems: "center",
      }),
      "biz-hero-title": {
        ...createHeadingNode(
          "biz-hero-title",
          "Nâng Tầm Doanh Nghiệp",
          "h1",
          "biz-hero",
        ),
        props: {
          text: "Nâng Tầm Doanh Nghiệp",
          level: "h1",
          color: "#ffffff",
          fontSize: "48px",
        },
      },
      "biz-services": createContainerNode(
        "biz-services",
        ["biz-services-title"],
        "ROOT",
        {
          padding: 60,
        },
      ),
      "biz-services-title": createHeadingNode(
        "biz-services-title",
        "Dịch Vụ Của Chúng Tôi",
        "h2",
        "biz-services",
      ),
      "biz-about": createContainerNode(
        "biz-about",
        ["biz-about-title", "biz-about-text"],
        "ROOT",
        {
          backgroundColor: "#f3f4f6",
          padding: 60,
        },
      ),
      "biz-about-title": createHeadingNode(
        "biz-about-title",
        "Về Chúng Tôi",
        "h2",
        "biz-about",
      ),
      "biz-about-text": createTextNode(
        "biz-about-text",
        "Chúng tôi là đơn vị hàng đầu trong lĩnh vực tư vấn và phát triển giải pháp công nghệ.",
        "biz-about",
      ),
    },
  },
  {
    id: "blog",
    name: "Blog Cá Nhân",
    description: "Chia sẻ câu chuyện và ý tưởng của bạn với thế giới.",
    category: "blog",
    colors: {
      primary: "#f59e0b",
      secondary: "#fef3c7",
      text: "#111827",
      bg: "#ffffff",
    },
    data: {
      ROOT: {
        ...BASE_ROOT,
        nodes: ["blog-header", "blog-posts"],
      },
      "blog-header": createContainerNode(
        "blog-header",
        ["blog-name", "blog-desc"],
        "ROOT",
        {
          padding: 40,
          borderBottom: "1px solid #e5e7eb",
        },
      ),
      "blog-name": createHeadingNode(
        "blog-name",
        "Tên Blog",
        "h2",
        "blog-header",
      ),
      "blog-desc": createTextNode(
        "blog-desc",
        "Nơi chia sẻ kiến thức và đam mê.",
        "blog-header",
      ),
      "blog-posts": createContainerNode(
        "blog-posts",
        ["post-1", "post-2"],
        "ROOT",
        {
          padding: 40,
          gap: 30,
        },
      ),
      "post-1": createContainerNode(
        "post-1",
        ["post-1-title", "post-1-excerpt"],
        "blog-posts",
        {
          border: "1px solid #e5e7eb",
          padding: 20,
          borderRadius: "8px",
        },
      ),
      "post-1-title": createHeadingNode(
        "post-1-title",
        "Bài viết số 1",
        "h3",
        "post-1",
      ),
      "post-1-excerpt": createTextNode(
        "post-1-excerpt",
        "Tóm tắt nội dung bài viết...",
        "post-1",
      ),
      "post-2": createContainerNode(
        "post-2",
        ["post-2-title", "post-2-excerpt"],
        "blog-posts",
        {
          border: "1px solid #e5e7eb",
          padding: 20,
          borderRadius: "8px",
        },
      ),
      "post-2-title": createHeadingNode(
        "post-2-title",
        "Bài viết số 2",
        "h3",
        "post-2",
      ),
      "post-2-excerpt": createTextNode(
        "post-2-excerpt",
        "Tóm tắt nội dung bài viết...",
        "post-2",
      ),
    },
  },
  {
    id: "ecommerce",
    name: "Cửa Hàng Online",
    description: "Bắt đầu kinh doanh trực tuyến với mẫu cửa hàng hiện đại.",
    category: "ecommerce",
    colors: {
      primary: "#1f2937",
      secondary: "#f3f4f6",
      text: "#ffffff",
      bg: "#ffffff",
    },
    data: {
      ROOT: {
        ...BASE_ROOT,
        nodes: ["store-hero", "featured-products"],
      },
      "store-hero": createContainerNode(
        "store-hero",
        ["store-title", "shop-now-btn"],
        "ROOT",
        {
          height: "300px",
          backgroundColor: "#1f2937",
          justifyContent: "center",
          alignItems: "center",
        },
      ),
      "store-title": {
        ...createHeadingNode(
          "store-title",
          "Bộ Sưu Tập Mùa Hè",
          "h1",
          "store-hero",
        ),
        props: { text: "Bộ Sưu Tập Mùa Hè", level: "h1", color: "#ffffff" },
      },
      "shop-now-btn": {
        // Placeholder for button
        ...createHeadingNode(
          "shop-now-btn",
          "[Nút Mua Ngay]",
          "h3",
          "store-hero",
        ),
        props: { text: "[Nút Mua Ngay]", level: "h3", color: "#3b82f6" },
      },
      "featured-products": createContainerNode(
        "featured-products",
        ["products-title"],
        "ROOT",
        {
          padding: 40,
        },
      ),
      "products-title": createHeadingNode(
        "products-title",
        "Sản Phẩm Nổi Bật",
        "h2",
        "featured-products",
      ),
    },
  },
  {
    id: "event",
    name: "Sự Kiện",
    description: "Quảng bá sự kiện, hội thảo hoặc webinar của bạn.",
    category: "event",
    colors: {
      primary: "#4f46e5",
      secondary: "#f9fafb",
      text: "#ffffff",
      bg: "#ffffff",
    },
    data: {
      ROOT: {
        ...BASE_ROOT,
        nodes: ["event-hero", "event-details", "event-schedule"],
      },
      "event-hero": createContainerNode(
        "event-hero",
        ["event-title", "event-date"],
        "ROOT",
        {
          backgroundColor: "#4f46e5",
          padding: 80,
          alignItems: "center",
        },
      ),
      "event-title": {
        ...createHeadingNode(
          "event-title",
          "Tên Sự Kiện Lớn 2024",
          "h1",
          "event-hero",
        ),
        props: { text: "Tên Sự Kiện Lớn 2024", level: "h1", color: "#ffffff" },
      },
      "event-date": {
        ...createTextNode("event-date", "20/11/2024 - Hà Nội", "event-hero"),
        props: {
          text: "20/11/2024 - Hà Nội",
          color: "#e0e7ff",
          fontSize: "20px",
        },
      },
      "event-details": createContainerNode(
        "event-details",
        ["details-title", "details-text"],
        "ROOT",
        {
          padding: 60,
        },
      ),
      "details-title": createHeadingNode(
        "details-title",
        "Về Sự Kiện",
        "h2",
        "event-details",
      ),
      "details-text": createTextNode(
        "details-text",
        "Mô tả chi tiết về sự kiện, diễn giả và nội dung chương trình.",
        "event-details",
      ),
      "event-schedule": createContainerNode(
        "event-schedule",
        ["schedule-title"],
        "ROOT",
        {
          backgroundColor: "#f9fafb",
          padding: 60,
        },
      ),
      "schedule-title": createHeadingNode(
        "schedule-title",
        "Lịch Trình",
        "h2",
        "event-schedule",
      ),
    },
  },
];
