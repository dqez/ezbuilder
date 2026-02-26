"use client";

import { useEditor, Element } from "@craftjs/core";
import { useState } from "react";
import {
  Type,
  Heading1,
  Image as ImageIcon,
  MousePointerClick,
  Square,
  ArrowUpDown,
  Minus,
  CreditCard,
  Sparkles,
  Navigation,
  CircleArrowDown,
  LayoutGrid,
  TextQuote,
  Tv,
  Code,
  RectangleHorizontal,
  AlignLeft,
  List,
  CheckSquare,
  Grid,
  Columns as ColumnsIcon,
  ListCollapse,
  PanelTop,
  UserCircle2,
  BadgeDollarSign,
  Megaphone,
  BarChart3,
  ListChecks,
  Share2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeText } from "./components/NodeText";
import { NodeHeading } from "./components/NodeHeading";
import { NodeImage } from "./components/NodeImage";
import { NodeButton } from "./components/NodeButton";
import { NodeContainer } from "./components/NodeContainer";
import { NodeSpacer } from "./components/NodeSpacer";
import { NodeDivider } from "./components/NodeDivider";
import { NodeCard } from "./components/NodeCard";
import { NodeHero } from "./components/NodeHero";
import { NodeNavbar } from "./components/NodeNavbar";
import { NodeFooter } from "./components/NodeFooter";
import { NodeGallery } from "./components/NodeGallery";
import { NodeRichText } from "./components/NodeRichText";
import { NodeVideo } from "./components/NodeVideo";
import { NodeIcon } from "./components/NodeIcon";
import { NodeEmbed } from "./components/NodeEmbed";
import { NodeForm } from "./components/NodeForm";
import { NodeInput } from "./components/NodeInput";
import { NodeTextarea } from "./components/NodeTextarea";
import { NodeSelect } from "./components/NodeSelect";
import { NodeCheckbox } from "./components/NodeCheckbox";
import { NodeGrid } from "./components/NodeGrid";
import { NodeColumns } from "./components/NodeColumns";
import { NodeAccordion } from "./components/NodeAccordion";
import { NodeTabs } from "./components/NodeTabs";
import { NodeTestimonial } from "./components/NodeTestimonial";
import { NodePricing } from "./components/NodePricing";
import { NodeCTA } from "./components/NodeCTA";
import { NodeStats } from "./components/NodeStats";
import { NodeFeatureList } from "./components/NodeFeatureList";
import { NodeSocialIcons } from "./components/NodeSocialIcons";

interface ToolboxItemProps {
  label: string;
  icon: React.ReactNode;
  element: React.ReactElement;
}

const ToolboxItem = ({ label, icon, element }: ToolboxItemProps) => {
  const { connectors } = useEditor();

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border bg-card hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-grab transition-all text-center aspect-square shadow-sm"
      ref={(ref) => {
        if (ref) connectors.create(ref, element);
      }}
      title="Kéo thả vào trang web"
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
        {icon}
      </div>
      <span className="text-xs font-medium leading-tight">{label}</span>
    </div>
  );
};

export const Toolbox = () => {
  const [search, setSearch] = useState("");

  const groups = [
    {
      name: "Cơ bản",
      items: [
        {
          label: "Văn bản",
          icon: <Type className="w-4 h-4" />,
          element: (
            <NodeText
              text="Chỉnh sửa văn bản này"
              fontSize={16}
              color="#000000"
              textAlign="left"
            />
          ),
        },
        {
          label: "Tiêu đề",
          icon: <Heading1 className="w-4 h-4" />,
          element: (
            <NodeHeading
              text="Tiêu đề"
              level={1}
              color="#000000"
              textAlign="left"
            />
          ),
        },
        {
          label: "Hình ảnh",
          icon: <ImageIcon className="w-4 h-4" />,
          element: (
            <NodeImage src="" alt="Hình ảnh" width="100%" borderRadius={8} />
          ),
        },
        {
          label: "Nút bấm",
          icon: <MousePointerClick className="w-4 h-4" />,
          element: (
            <NodeButton
              text="Bấm vào đây"
              url="#"
              variant="default"
              size="default"
            />
          ),
        },
      ],
    },
    {
      name: "Văn bản & Media",
      items: [
        {
          label: "Văn bản phong phú",
          icon: <TextQuote className="w-4 h-4" />,
          element: (
            <NodeRichText
              text="Chỉnh sửa văn bản này"
              fontSize={16}
              color="#000000"
              textAlign="left"
              fontWeight={400}
            />
          ),
        },
        {
          label: "Video",
          icon: <Tv className="w-4 h-4" />,
          element: (
            <NodeVideo
              url=""
              autoplay={false}
              muted={false}
              aspectRatio="16:9"
            />
          ),
        },
        {
          label: "Biểu tượng",
          icon: <Sparkles className="w-4 h-4" />,
          element: (
            <NodeIcon
              iconName="Star"
              size={24}
              color="#000000"
              backgroundColor="transparent"
              borderRadius={0}
              padding={8}
            />
          ),
        },
        {
          label: "Nhúng mã",
          icon: <Code className="w-4 h-4" />,
          element: <NodeEmbed embedCode="" width="100%" height="400px" />,
        },
      ],
    },
    {
      name: "Biểu mẫu",
      items: [
        {
          label: "Khung biểu mẫu",
          icon: <RectangleHorizontal className="w-4 h-4" />,
          element: (
            <NodeForm
              padding={16}
              gap={16}
              backgroundColor="transparent"
              borderColor="transparent"
              borderWidth={0}
              borderRadius={0}
            />
          ),
        },
        {
          label: "Ô nhập liệu",
          icon: <Type className="w-4 h-4" />,
          element: (
            <NodeInput
              label="Nhãn"
              placeholder="Nhập tại đây..."
              inputType="text"
              required={false}
              name="input"
            />
          ),
        },
        {
          label: "Vùng văn bản",
          icon: <AlignLeft className="w-4 h-4" />,
          element: (
            <NodeTextarea
              label="Tin nhắn"
              placeholder="Nhập tin nhắn..."
              rows={4}
              required={false}
              name="message"
            />
          ),
        },
        {
          label: "Danh sách chọn",
          icon: <List className="w-4 h-4" />,
          element: (
            <NodeSelect
              label="Chọn mục"
              placeholder="Chọn một..."
              options="Lựa chọn 1, Lựa chọn 2, Lựa chọn 3"
              required={false}
              name="select"
            />
          ),
        },
        {
          label: "Hộp kiểm",
          icon: <CheckSquare className="w-4 h-4" />,
          element: (
            <NodeCheckbox
              label="Tôi đồng ý"
              required={false}
              name="checkbox"
              defaultChecked={false}
            />
          ),
        },
      ],
    },
    {
      name: "Bố cục",
      items: [
        {
          label: "Khung chứa",
          icon: <Square className="w-4 h-4" />,
          element: (
            <Element
              canvas
              is={NodeContainer}
              padding={16}
              backgroundColor="transparent"
              flexDirection="column"
              gap={8}
            />
          ),
        },
        {
          label: "Khoảng cách",
          icon: <ArrowUpDown className="w-4 h-4" />,
          element: <NodeSpacer height={32} />,
        },
        {
          label: "Đường kẻ",
          icon: <Minus className="w-4 h-4" />,
          element: <NodeDivider color="#e5e7eb" thickness={1} margin={16} />,
        },
        {
          label: "Lưới",
          icon: <Grid className="w-4 h-4" />,
          element: (
            <NodeGrid
              columns={3}
              gap={16}
              padding={16}
              backgroundColor="transparent"
            />
          ),
        },
        {
          label: "Cột",
          icon: <ColumnsIcon className="w-4 h-4" />,
          element: (
            <NodeColumns
              columns={2}
              gap={16}
              padding={16}
              backgroundColor="transparent"
            />
          ),
        },
        {
          label: "Xếp gọn",
          icon: <ListCollapse className="w-4 h-4" />,
          element: <NodeAccordion items={["Phần 1", "Phần 2", "Phần 3"]} />,
        },
        {
          label: "Tab",
          icon: <PanelTop className="w-4 h-4" />,
          element: (
            <NodeTabs tabs={["Tab 1", "Tab 2", "Tab 3"]} defaultValue="tab-0" />
          ),
        },
      ],
    },
    {
      name: "Tiếp thị",
      items: [
        {
          label: "Đánh giá",
          icon: <UserCircle2 className="w-4 h-4" />,
          element: (
            <NodeTestimonial
              quote="Đây là đánh giá mẫu"
              author="Nguyễn Văn A"
              role="Giám đốc"
              avatarUrl="https://avatars.githubusercontent.com/u/124875024?v=4"
            />
          ),
        },
        {
          label: "Bảng giá",
          icon: <BadgeDollarSign className="w-4 h-4" />,
          element: (
            <NodePricing
              title="Gói Pro"
              price="299.000đ"
              benefits="Tính năng 1, Tính năng 2"
              buttonText="Mua ngay"
            />
          ),
        },
        {
          label: "Kêu gọi hành động",
          icon: <Megaphone className="w-4 h-4" />,
          element: (
            <NodeCTA
              title="Kêu gọi hành động"
              subtitle="Mô tả ngắn tại đây"
              buttonText="Bấm vào đây"
              buttonLink="#"
            />
          ),
        },
        {
          label: "Thống kê",
          icon: <BarChart3 className="w-4 h-4" />,
          element: <NodeStats stats="100+: Người dùng, 99%: Hài lòng" />,
        },
        {
          label: "Tính năng",
          icon: <ListChecks className="w-4 h-4" />,
          element: (
            <NodeFeatureList features="Tính năng 1: Mô tả | Tính năng 2: Mô tả" />
          ),
        },
        {
          label: "Mạng xã hội",
          icon: <Share2 className="w-4 h-4" />,
          element: (
            <NodeSocialIcons
              twitter="#"
              github="#"
              facebook=""
              instagram=""
              linkedin=""
              youtube=""
            />
          ),
        },
      ],
    },
    {
      name: "Có sẵn",
      items: [
        {
          label: "Thẻ",
          icon: <CreditCard className="w-4 h-4" />,
          element: (
            <NodeCard title="Tiêu đề thẻ" description="Mô tả thẻ" imageUrl="" />
          ),
        },
        {
          label: "Hero",
          icon: <Sparkles className="w-4 h-4" />,
          element: (
            <NodeHero
              title="Xây dựng website tuyệt vời"
              subtitle="Tạo trang đích đẹp mắt"
              backgroundImage=""
              ctaText="Bắt đầu ngay"
              ctaUrl="#"
            />
          ),
        },
        {
          label: "Thanh điều hướng",
          icon: <Navigation className="w-4 h-4" />,
          element: (
            <NodeNavbar
              logo="Thương hiệu"
              links={[
                { label: "Trang chủ", url: "#" },
                { label: "Giới thiệu", url: "#" },
              ]}
            />
          ),
        },
        {
          label: "Chân trang",
          icon: <CircleArrowDown className="w-4 h-4" />,
          element: (
            <NodeFooter copyright="© 2026 Thương hiệu" socialLinks={[]} />
          ),
        },
        {
          label: "Bộ sưu tập",
          icon: <LayoutGrid className="w-4 h-4" />,
          element: <NodeGallery images={[]} columns={2} gap={16} />,
        },
      ],
    },
    {
      name: "Mẫu kết hợp",
      items: [
        {
          label: "Hero + Tóm tắt",
          icon: <PanelTop className="w-4 h-4" />,
          element: (
            <Element
              canvas
              is={NodeContainer}
              padding={0}
              gap={0}
              backgroundColor="transparent"
              flexDirection="column"
            >
              <NodeHero
                title="Bắt đầu hành trình mới"
                subtitle="Nền tảng giúp bạn xây dựng ứng dụng với AI."
                ctaText="Dùng thử miễn phí"
                ctaUrl="#"
                backgroundImage=""
              />
              <NodeStats stats="10M+: Người dùng, 99%: Hài lòng, 24/7: Hỗ trợ" />
            </Element>
          ),
        },
        {
          label: "Bảng giá + Đánh giá",
          icon: <BadgeDollarSign className="w-4 h-4" />,
          element: (
            <Element
              canvas
              is={NodeContainer}
              padding={0}
              gap={32}
              backgroundColor="transparent"
              flexDirection="column"
            >
              <NodePricing
                title="Gói Cao cấp"
                price="999.000đ/tháng"
                benefits="Tính năng 1, Tính năng 2, Tính năng 3"
                buttonText="Đăng ký ngay"
              />
              <NodeTestimonial
                quote="Sản phẩm này đã thay đổi cách chúng tôi làm việc."
                author="Trần Văn B"
                role="CEO, Công ty Tech"
                avatarUrl="https://avatars.githubusercontent.com/u/124875024?v=4"
              />
            </Element>
          ),
        },
      ],
    },
  ];

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((group) => group.items.length > 0);

  const basicGroups = filteredGroups.filter(
    (g) => !["Biểu mẫu", "Bố cục", "Mẫu kết hợp"].includes(g.name),
  );
  const advancedGroups = filteredGroups.filter((g) =>
    ["Biểu mẫu", "Bố cục"].includes(g.name),
  );
  const sectionGroups = filteredGroups.filter((g) =>
    ["Mẫu kết hợp"].includes(g.name),
  );

  const renderGroups = (groupsToRender: typeof filteredGroups) => {
    if (groupsToRender.length === 0) {
      return (
        <div className="p-4 text-center text-xs text-muted-foreground">
          Không tìm thấy thành phần nào
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {groupsToRender.map((group) => (
          <div key={group.name} className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              {group.name}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {group.items.map((item) => (
                <ToolboxItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  element={item.element}
                />
              ))}
            </div>
            <Separator className="my-4 hidden last:block" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4 flex flex-col h-full overflow-hidden">
      <div className="relative shrink-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm thành phần..."
          className="pl-9 h-9 bg-muted/50 rounded-lg text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full grid grid-cols-3 mb-4 shrink-0">
          <TabsTrigger value="basic">Cơ bản</TabsTrigger>
          <TabsTrigger value="advanced">Nâng cao</TabsTrigger>
          <TabsTrigger value="sections">Mẫu khối</TabsTrigger>
        </TabsList>
        <TabsContent
          value="basic"
          className="flex-1 overflow-y-auto pr-1 pb-20"
        >
          {renderGroups(basicGroups)}
        </TabsContent>
        <TabsContent
          value="advanced"
          className="flex-1 overflow-y-auto pr-1 pb-20"
        >
          {renderGroups(advancedGroups)}
        </TabsContent>
        <TabsContent
          value="sections"
          className="flex-1 overflow-y-auto pr-1 pb-20"
        >
          {renderGroups(sectionGroups)}
        </TabsContent>
      </Tabs>
    </div>
  );
};
