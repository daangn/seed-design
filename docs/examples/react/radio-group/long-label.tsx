import { VStack } from "@seed-design/react";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";

export default function RadioGroupLongLabel() {
  return (
    <VStack gap="x2">
      <RadioGroup defaultValue="medium">
        <RadioGroupItem
          value="medium"
          size="medium"
          label="Lorem ipsum dolor sit, amet consectetur adipisicing elit. At a eaque fugiat sint sapiente.
            Id, hic ex, blanditiis totam animi amet delectus temporibus quae fugiat magnam, quos eaque
            dolorum a? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus labore unde
            minus temporibus beatae commodi et nesciunt iure in dignissimos suscipit, alias ab
            voluptatem facilis tempora numquam. Veritatis, dolorum suscipit! Lorem ipsum dolor sit,
            amet consectetur adipisicing elit. Explicabo fugiat molestias iusto, ipsum distinctio
            officia ad id ratione esse ducimus architecto deleniti illum reiciendis rerum, at
            blanditiis molestiae. Cupiditate, nobis? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ab, magni. Aliquid inventore quaerat nemo architecto harum earum quas
            porro repudiandae explicabo repellat repellendus magni, corporis omnis laborum, velit
            dicta blanditiis. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis,
            eveniet quas. Accusamus facere veritatis expedita delectus, asperiores numquam placeat
            necessitatibus assumenda, nesciunt in dolorem sit provident repellendus, voluptatem earum!
            Consequatur. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut earum
            asperiores aliquam magnam est delectus veritatis numquam sint porro tenetur dolores nobis,
            deleniti voluptas quaerat, quia voluptatum soluta autem perspiciatis? Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Facilis possimus eaque aliquam maxime? Quidem enim,
            sed itaque at veritatis nihil officia esse qui provident ipsa adipisci necessitatibus
            officiis distinctio laborum!"
        />
        <RadioGroupItem
          value="large"
          size="large"
          label="Lorem ipsum dolor sit, amet consectetur adipisicing elit. At a eaque fugiat sint sapiente.
            Id, hic ex, blanditiis totam animi amet delectus temporibus quae fugiat magnam, quos eaque
            dolorum a? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus labore unde
            minus temporibus beatae commodi et nesciunt iure in dignissimos suscipit, alias ab
            voluptatem facilis tempora numquam. Veritatis, dolorum suscipit! Lorem ipsum dolor sit,
            amet consectetur adipisicing elit. Explicabo fugiat molestias iusto, ipsum distinctio
            officia ad id ratione esse ducimus architecto deleniti illum reiciendis rerum, at
            blanditiis molestiae. Cupiditate, nobis? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Ab, magni. Aliquid inventore quaerat nemo architecto harum earum quas
            porro repudiandae explicabo repellat repellendus magni, corporis omnis laborum, velit
            dicta blanditiis. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis,
            eveniet quas. Accusamus facere veritatis expedita delectus, asperiores numquam placeat
            necessitatibus assumenda, nesciunt in dolorem sit provident repellendus, voluptatem earum!
            Consequatur. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut earum
            asperiores aliquam magnam est delectus veritatis numquam sint porro tenetur dolores nobis,
            deleniti voluptas quaerat, quia voluptatum soluta autem perspiciatis? Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Facilis possimus eaque aliquam maxime? Quidem enim,
            sed itaque at veritatis nihil officia esse qui provident ipsa adipisci necessitatibus
            officiis distinctio laborum!"
        />
      </RadioGroup>
    </VStack>
  );
}
