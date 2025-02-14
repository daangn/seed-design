// @ts-nocheck

export function TextExample() {
  return (
    (<div>
      <p className="text-fg-brand">Primary Text</p>
      <p className="text-gray-900">Secondary Text</p>
      <p className="text-fg-positive">Success Text</p>
      <p className="text-fg-warning">Warning Text</p>
      <p className="text-fg-critical">Critical Text</p>
      <span className="text-gray-600">Scale Gray Text</span>
      <span className="text-carrot-600">Scale Carrot Text</span>
      <em className="text-static-black not-italic">Static Black Text</em>

      {/* State variations */}
      <button className="text-fg-brand hover:text-fg-brand-contrast">Hover Primary Text</button>
      <a className="text-fg-positive hover:text-fg-positive-contrast focus:text-fg-positive">
        Interactive Success Text
      </a>
      <p className="text-fg-critical hover:text-fg-critical-contrast active:text-fg-critical">
        Interactive Critical Text
      </p>
      <span className="text-gray-600 hover:text-gray-700 focus:text-gray-800">
        Interactive Gray Text
      </span>
      <div className="text-fg-neutral-subtle hover:text-fg-neutral focus:text-fg-neutral-muted">
        Complex State Text
      </div>
    </div>)
  );
}
