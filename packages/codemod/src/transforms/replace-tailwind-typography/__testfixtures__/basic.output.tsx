// @ts-nocheck

export function BasicExample() {
  return (
    <div>
      <div className="t3-bold whitespace-pre-wrap text-center text-[--tick-color]">Primary Background</div>
      <p className="t4-regular text-palette-gray-800">{formState.content}</p>
      <div className="t6-bold">Hover Primary Low Background</div>
      <div className="t2-regular">Focus Primary Low Background</div>
      <div className="[&>section_h2]:t5-bold">Focus Primary Low Background</div>
      <h3 className={cn("t5-bold", className)} {...props} />
      <h3 className={isDisabled ? "t5-regular" : "t5-bold"} {...props} />
      <p className="t2-regular text-palette-gray-800">{description}</p>
      <div className="t3-bold">Text with prefix</div>
      <span className="t4-regular">Another text with prefix</span>
      <h2 className="t6-bold">Title with prefix</h2>
    </div>
  );
}
