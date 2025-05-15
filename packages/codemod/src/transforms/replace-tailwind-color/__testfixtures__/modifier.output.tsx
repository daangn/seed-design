// @ts-nocheck

export function ModifierExample() {
    return (
      <div>
        <div className="!bg-bg-brand-solid">Primary Background</div>
        <div className="!bg-palette-carrot-100">Primary Low Background</div>
        <div className="hover:!bg-palette-carrot-100">Hover Primary Low Background</div>
        <div className="focus:!bg-palette-carrot-100">Focus Primary Low Background</div>
        <div className="active:!bg-palette-carrot-100">Active Primary Low Background</div>
        <div className="!bg-palette-gray-600">Scale Background</div>
        <div className="dark:bg-palette-carrot-200">Scale Carrot Low Background</div>
        <div className="light:bg-palette-carrot-300">Scale Carrot Mid Background</div>
        <div className="dark:bg-palette-carrot-400">Scale Carrot High Background</div>
        <div className="light:bg-palette-carrot-500">Scale Carrot High Background</div>
        <div className="dark:bg-palette-carrot-600">Scale Carrot High Background</div>
        <div className="sm:bg-palette-carrot-600">Scale Carrot High Background</div>
        <div className="md:bg-palette-carrot-700">Scale Carrot High Background</div>
        <div className="lg:bg-palette-carrot-700">Scale Carrot High Background</div>
        <div className="xl:bg-palette-carrot-800">Scale Carrot High Background</div>
        <div className="!bg-palette-carrot-800">Scale Carrot High Background</div>
        <div className="first:bg-palette-static-black">Static Black Background</div>
        <div className="last:bg-palette-static-white">Static White Background</div>
        <div className="odd:bg-palette-static-black">Static Gray900 Background</div>
      </div>
    );
  }
  