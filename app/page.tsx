import InventorySearchForm from "@/components/inventorytable";


export default async function Home() {

  return (
    <div className="items-center justify-items-center min-h-screen p-8 pt-0 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#36454f]">
      <InventorySearchForm />
    </div>
  );
}
