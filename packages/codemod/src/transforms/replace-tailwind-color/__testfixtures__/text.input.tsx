// @ts-nocheck

export function TextExample() {
  return (
    <div>
      <p className="text-primary">Primary Text</p>
      <p className="text-secondary">Secondary Text</p>
      <p className="text-success">Success Text</p>
      <p className="text-warning">Warning Text</p>
      <p className="text-critical">Critical Text</p>
      <span className="text-gray-500">Scale Gray Text</span>
      <span className="text-carrot-500">Scale Carrot Text</span>
      <em className="text-static-black not-italic">Static Black Text</em>

      {/* State variations */}
      <button className="text-primary hover:text-primary-hover">Hover Primary Text</button>
      <a className="text-success hover:text-success-hover focus:text-success-pressed">
        Interactive Success Text
      </a>
      <p className="text-critical hover:text-critical-hover active:text-critical-pressed">
        Interactive Critical Text
      </p>
      <span className="text-gray-500 hover:text-gray-600 focus:text-gray-700">
        Interactive Gray Text
      </span>
      <div className="text-secondary-low hover:text-secondary focus:text-secondary-pressed">
        Complex State Text
      </div>
    </div>
  );
}
