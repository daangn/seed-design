// @ts-nocheck

export function BackgroundExample() {
    return (
      <div>
        <div UNSAFE_className="bg-primary">Primary Background</div>
        <div UNSAFE_className="bg-primaryLow">Primary Low Background</div>
        <div UNSAFE_className="hover:bg-primaryLow">Hover Primary Low Background</div>
        <div UNSAFE_className="focus:bg-primaryLow">Focus Primary Low Background</div>
        <div UNSAFE_className="active:bg-primaryLow">Active Primary Low Background</div>
        <div UNSAFE_className="bg-gray500">Scale Background</div>
        <div UNSAFE_className="bg-carrot100">Scale Carrot Low Background</div>
        <div UNSAFE_className="bg-carrot200">Scale Carrot Mid Background</div>
        <div UNSAFE_className="bg-carrot300">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-carrot400">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-carrot500">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-carrot600">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-carrot700">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-carrot800">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-carrot900">Scale Carrot High Background</div>
        <div UNSAFE_className="!bg-carrot900">Scale Carrot High Background</div>
        <div UNSAFE_className="bg-staticBlack">Static Black Background</div>
        <div UNSAFE_className="bg-staticWhite">Static White Background</div>
        <div UNSAFE_className="bg-staticGray900">Static Gray900 Background</div>
        <div UNSAFE_className="[&_[data-part='field']]:!bg-paperDefault" />
      </div>
    );
  }
  