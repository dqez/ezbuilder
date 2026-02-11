"use client";

import { useNode } from "@craftjs/core";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface NodePricingProps {
  title: string;
  price: string;
  benefits: string; // Comma separated list
  buttonText: string;
  isPopular?: boolean;
}

export const NodePricing = ({
  title = "Pro Plan",
  price = "$29",
  benefits = "Custom Domains, unlimited Storage, Priority Support, 5 Team Members",
  buttonText = "Get Started",
  isPopular = false,
}: NodePricingProps) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const benefitList = benefits.split(",").map((b) => b.trim());

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      className="w-full max-w-sm"
      style={{
        outline: selected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        cursor: "grab",
      }}
    >
      <Card
        className={`relative flex flex-col ${isPopular ? "border-primary shadow-lg" : ""}`}
      >
        {isPopular && (
          <div className="absolute top-0 right-0 -mr-2 -mt-2">
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground"
            >
              Most Popular
            </Badge>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>Perfect for growing businesses</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-4xl font-bold mb-4">
            {price}
            <span className="text-base font-normal text-muted-foreground">
              /mo
            </span>
          </div>
          <ul className="space-y-2 mt-4">
            {benefitList.map((benefit, index) => (
              <li key={index} className="flex items-center text-sm">
                <Check className="w-4 h-4 mr-2 text-green-500" />
                {benefit}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            variant={isPopular ? "default" : "outline"}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

NodePricing.craft = {
  displayName: "Pricing",
  props: {
    title: "Pro Plan",
    price: "$29",
    benefits:
      "Custom Domains, Unlimited Storage, Priority Support, 5 Team Members",
    buttonText: "Get Started",
    isPopular: true,
  },
  related: {},
};
