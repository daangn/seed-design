// @ts-nocheck

export function TextExample() {
  return (
    (<div>
      <p className="text-brand">Primary Text</p>
      <p className="text-gray-900">Secondary Text</p>
      <p className="text-positive">Success Text</p>
      <p className="text-yellow-300">Warning Text</p>
      <p className="text-critical">Critical Text</p>
      <span className="text-gray-600">Scale Gray Text</span>
      <span className="text-carrot-600">Scale Carrot Text</span>
      <em className="text-static-black not-italic">Static Black Text</em>
      {/* State variations */}
      <button className="text-brand hover:text-carrot-100">Hover Primary Text</button>
      <a className="text-positive hover:text-green-100 focus:text-green-100">
        Interactive Success Text
      </a>
      <p className="text-critical hover:text-red-100 active:text-red-100">
        Interactive Critical Text
      </p>
      <span className="text-gray-600 hover:text-gray-700 focus:text-gray-800">
        Interactive Gray Text
      </span>
      <div className="text-gray-200 hover:text-gray-900">
        Complex State Text
      </div>
    </div>)
  );
}
