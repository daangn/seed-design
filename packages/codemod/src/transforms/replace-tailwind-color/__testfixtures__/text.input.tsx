// @ts-nocheck

export function TextExample() {
  return (
    <div>
      <p className="text-primary">Primary Text</p>
      <p className="text-secondary">Secondary Text</p>
      <p className="text-success">Success Text</p>
      <p className="text-warning">Warning Text</p>
      <p className="text-danger">Critical Text</p>
      <span className="text-gray500">Scale Gray Text</span>
      <span className="text-carrot500">Scale Carrot Text</span>
      <span className="after:text-carrot500">Scale Carrot Text</span>
      <em className="text-staticBlack not-italic">Static Black Text</em>

      {/* State variations */}
      <button className="text-primary hover:text-primaryLow">Hover Primary Text</button>
      <a className="text-success hover:text-successLow focus:text-successLow">
        Interactive Success Text
      </a>
      <p className="text-danger hover:text-dangerLow active:text-dangerLow">
        Interactive Critical Text
      </p>
      <span className="text-gray500 hover:text-gray600 focus:text-gray700">
        Interactive Gray Text
      </span>
      <div className="text-secondaryLow hover:text-secondary">
        Complex State Text
      </div>
    </div>
  );
}
