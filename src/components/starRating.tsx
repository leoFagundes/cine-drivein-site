"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import classNames from "classnames";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1.5 sm:gap-2" onMouseLeave={() => setHover(null)}>
      {stars.map((star) => {
        const filled = (hover ?? value) >= star;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star === value ? 0 : star)}
            onMouseEnter={() => setHover(star)}
            className="transition-transform duration-150 hover:scale-125 active:scale-95"
            aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
          >
            <FaStar
              size={36}
              className={classNames("transition-colors duration-150", {
                "text-amber-400 drop-shadow-sm": filled,
                "text-stone-300": !filled,
              })}
            />
          </button>
        );
      })}
    </div>
  );
}
