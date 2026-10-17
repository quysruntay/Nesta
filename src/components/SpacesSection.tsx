
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import Living from "../assets/images/spaces/living-room.jpg";
import Bedroom from "../assets/images/spaces/bedroom.jpg";
import Dining from "../assets/images/spaces/dining-room.jpg";
import Office from "../assets/images/spaces/office.jpg";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-7 flex items-center justify-center gap-3">
      <span className="h-px w-12 bg-[#aaa19a] sm:w-30" />

      <h2
        className="
          text-[18px]
          font-semibold
          tracking-wide
          text-[#2d261f]
          sm:text-[32px]
        "
      >
        {children}
      </h2>

      <span className="h-px w-12 bg-[#aaa19a] sm:w-30" />
    </div>
  );
}

// Danh sách không gian nội thất
const spaces = [
  {
    name: "Phòng khách",
    image: Living,
    room: "Phòng khách",
  },
  {
    name: "Phòng ngủ",
    image: Bedroom,
    room: "Phòng ngủ",
  },
  {
    name: "Phòng ăn",
    image: Dining,
    room: "Phòng ăn",
  },
  {
    name: "Phòng làm việc",
    image: Office,
    room: "Phòng làm việc",
  },
];

function SpacesSection() {
  return (
    <section className="bg-[#f7f1ed] px-5 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">

        <SectionTitle>
          THEO KHÔNG GIAN
        </SectionTitle>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {spaces.map((space) => {
            return (
              <Link
                key={space.name}
                to={`/products?room=${encodeURIComponent(space.room)}`}
                className="group block"
                aria-label={`Xem sản phẩm cho ${space.name}`}
              >
                <div
                  className="
                    aspect-[4/3]
                    overflow-hidden
                    rounded-2xl
                    bg-[#e9e4de]
                  "
                >
                  <img
                    src={space.image}
                    alt={space.name}
                    loading="lazy"
                    className="
                      h-full w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />
                </div>

                <h3
                  className="
                    mt-4
                    text-center
                    text-sm
                    font-medium
                    text-[#2d261f]
                    transition-colors
                    group-hover:text-[#6e5a47]
                  "
                >
                  {space.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SpacesSection;
