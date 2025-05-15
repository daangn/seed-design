// @ts-nocheck

export function TextExample() {
  return (
    <div>
      <p className="text-fg-brand">Primary Text</p>
      <p className="text-palette-gray-900">Secondary Text</p>
      <p className="text-fg-positive">Success Text</p>
      <p className="text-palette-yellow-500">Warning Text</p>
      <p className="text-fg-critical">Critical Text</p>
      <span className="text-palette-gray-600">Scale Gray Text</span>
      <span className="text-palette-carrot-600">Scale Carrot Text</span>
      <span className="after:text-palette-carrot-600">Scale Carrot Text</span>
      <em className="text-palette-static-black not-italic">Static Black Text</em>
      {/* State variations */}
      <button className="text-fg-brand hover:text-palette-carrot-100">Hover Primary Text</button>
      <a className="text-fg-positive hover:text-palette-green-100 focus:text-palette-green-100">
        Interactive Success Text
      </a>
      <p className="text-fg-critical hover:text-palette-red-100 active:text-palette-red-100">
        Interactive Critical Text
      </p>
      <span className="text-palette-gray-600 hover:text-palette-gray-700 focus:text-palette-gray-800">
        Interactive Gray Text
      </span>
      <div className="text-palette-gray-200 hover:text-palette-gray-900">
        Complex State Text
      </div>
    </div>
  );
}
