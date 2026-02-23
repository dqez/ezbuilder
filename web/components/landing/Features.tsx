"use client";

import { motion } from "framer-motion";
import {
  Laptop,
  Layout,
  Palette,
  Search,
  Zap,
  MousePointer2,
} from "lucide-react";

const features = [
  {
    title: "Drag & Drop trực quan",
    description:
      "Tự do sắp xếp mọi thành phần trên trang theo ý muốn. Những gì bạn thấy là những gì người dùng sẽ thấy.",
    icon: <MousePointer2 className="w-6 h-6 text-blue-500" />,
    className:
      "md:col-span-2 bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20",
  },
  {
    title: "Responsive",
    description:
      "Giao diện tự động thích ứng hoàn hảo trên Mobile, Tablet & Desktop.",
    icon: <Laptop className="w-6 h-6 text-purple-500" />,
    className:
      "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20",
  },
  {
    title: "50+ Components",
    description:
      "Kho thư viện phong phú từ Hero, Features, Pricing đến Testimonials.",
    icon: <Layout className="w-6 h-6 text-green-500" />,
    className:
      "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20",
  },
  {
    title: "Tối ưu hóa SEO",
    description:
      "Code clean, load nhanh và cấu trúc chuẩn SEO giúp website dễ dàng lên top Google.",
    icon: <Search className="w-6 h-6 text-orange-500" />,
    className:
      "md:col-span-2 bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/20",
  },
  {
    title: "Tùy chỉnh Style",
    description:
      "Bộ chỉnh màu sắc, font chữ và spacing chi tiết đến từng pixel.",
    icon: <Palette className="w-6 h-6 text-pink-500" />,
    className:
      "bg-pink-50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-900/20",
  },
  {
    title: "Hiệu suất cao",
    description:
      "Web Vitals đạt điểm xanh tuyệt đối nhờ công nghệ Next.js mới nhất.",
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    className:
      "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/20",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Mọi thứ bạn cần để <br />
            <span className="text-primary">Xây dựng Website đỉnh cao</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Không chỉ là kéo thả,{" "}
            {process.env.NEXT_PUBLIC_APP_NAME || "EZBuilder"} cung cấp bộ công
            cụ mạnh mẽ dành cho cả marketer và developer.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-8 rounded-2xl border ${feature.className} transition-shadow hover:shadow-lg`}
            >
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
