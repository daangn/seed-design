// @ts-nocheck

export function BackgroundExample() {
    return (
      <div>
        <div UNSAFE_className="bg-bg-brand-solid">Primary Background</div>
        <div UNSAFE_className="bg-palette-carrot-100">Primary Low Background</div>
        <div UNSAFE_className="hover:bg-palette-carrot-100">Hover Primary Low Background</div>
        <div UNSAFE_className="focus:bg-palette-carrot-100">Focus Primary Low Background</div>
        <div UNSAFE_className="active:bg-palette-carrot-100">Active Primary Low Background</div>
        <div UNSAFE_className="bg-palette-gray-600">Scale Background</div>
        <div UNSAFE_className="bg-palette-carrot-200">Scale Carrot Low Background</div>
        <div UNSAFE_className="bg-palette-carrot-300">Scale Carrot Mid Background</div>
        <div UNSAFE_className="bg-palette-carrot-400">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-palette-carrot-500">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-palette-carrot-600">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-palette-carrot-600">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-palette-carrot-700">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-palette-carrot-700">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-palette-carrot-800">Scale Carrot High Background</div>
        <div UNSAFE_className="!bg-palette-carrot-800">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-palette-static-black">Static Black Background</div>
        <div UNSAFE_className="bg-palette-static-white">Static White Background</div>
        <div UNSAFE_className="bg-palette-static-black">Static Gray900 Background</div>
        <div UNSAFE_className="[&_[data-part='field']]:!bg-bg-layer-default" />
      </div>
    );
  }
  