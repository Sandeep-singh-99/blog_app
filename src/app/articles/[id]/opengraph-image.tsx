import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

// Image metadata
export const alt = "BitWrite Article Preview";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!article) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#09090b",
            color: "#fff",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 60, fontWeight: "bold", color: "#ef4444" }}>404</div>
          <div style={{ fontSize: 30, marginTop: 20 }}>Article Not Found</div>
        </div>
      ),
      { ...size }
    );
  }

  // Format date
  const formattedDate = new Date(article.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Render dynamic OG Image
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b", // zinc-950
          backgroundImage: "radial-gradient(circle at top left, #1e1b4b 0%, #09090b 80%)",
          padding: "80px",
          boxSizing: "border-box",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Section: Category and Site Name */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(99, 102, 241, 0.15)", // indigo-500/15
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "9999px",
              padding: "8px 20px",
              fontSize: "20px",
              fontWeight: 600,
              color: "#818cf8", // indigo-400
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {article.category}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            <span style={{ color: "#6366f1", marginRight: "6px" }}>✦</span> BitWrite
          </div>
        </div>

        {/* Middle Section: Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "40px",
            marginBottom: "40px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.25,
              maxHeight: "210px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {article.title}
          </div>
        </div>

        {/* Bottom Section: Author and Date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "32px",
            width: "100%",
          }}
        >
          {article.author.imageUrl ? (
            <img
              src={article.author.imageUrl}
              alt={article.author.name}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "32px",
                objectFit: "cover",
                marginRight: "20px",
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            />
          ) : (
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "32px",
                backgroundColor: "#3f3f46",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "#fff",
                marginRight: "20px",
                fontWeight: "bold",
              }}
            >
              {article.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "22px", fontWeight: 600, color: "#ffffff" }}>
              {article.author.name}
            </div>
            <div style={{ fontSize: "18px", color: "#a1a1aa", marginTop: "4px" }}>
              Published on {formattedDate}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
