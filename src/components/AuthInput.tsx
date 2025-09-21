import React from "react";
import { Icon as LucideIcon } from "lucide-react";

type Props = {
  label: string;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function AuthInput({
  label,
  placeholder,
  type = "text",
  icon: IconComp,
}: Props) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#F5F5F5",
          padding: "8px 12px",
          borderRadius: 8,
        }}
      >
        {IconComp ? (
          <IconComp width={18} height={18} style={{ marginRight: 8 }} />
        ) : null}
        <input
          type={type}
          placeholder={placeholder}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            flex: 1,
          }}
        />
      </div>
    </div>
  );
}
