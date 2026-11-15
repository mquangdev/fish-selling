import { formatPrice, type FishVariant } from "@/lib/fish";

export default function VariantsTable({
  variants,
}: {
  variants: FishVariant[];
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-ocean-900">Size và giá</h2>
      <table className="mt-2 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ocean-200 text-ocean-700">
            <th scope="col" className="py-2 pr-2 font-semibold">
              Phân loại
            </th>
            <th scope="col" className="py-2 pr-2 font-semibold">
              Size
            </th>
            <th scope="col" className="py-2 text-right font-semibold">
              Giá
            </th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant.label} className="border-b border-ocean-100">
              <td className="py-3 pr-2 font-medium text-ocean-900">
                {variant.label}
              </td>
              <td className="py-3 pr-2 text-ocean-800">{variant.sizeCm} cm</td>
              <td className="py-3 text-right font-semibold text-ocean-900">
                {formatPrice(variant.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
