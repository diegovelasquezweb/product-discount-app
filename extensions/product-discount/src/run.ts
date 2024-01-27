import type { RunInput, FunctionRunResult } from "../generated/api";
import { DiscountApplicationStrategy } from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input: RunInput): FunctionRunResult {
  const targets: Target[] = input.cart.lines.filter(line => {
    if(line.merchandise.__typename === "ProductVariant") {
      const hasLimitedEditionTag = line.merchandise.product.hasAnyTag;
      return hasLimitedEditionTag === false;
    }
    return false;
  }).map((line => {
    return {
      productVariant: {
        id: (line.merchandise as ProductVariant).id,
      },
    }
  }));


  const DISCOUNT_ITEMS: FunctionRunResult = {
    discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
    discounts: [
      {
        targets: targets,
        value: {
          percentage: {
            value: 10,
          }
        },
        message: "10% off",
      }
    ]

  }
  
  return targets.length === 0 ?  EMPTY_DISCOUNT : DISCOUNT_ITEMS;
};