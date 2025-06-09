// @ts-nocheck

export function BasicExample() {
  return (
    <div>
      <div className="caption1Bold whitespace-pre-wrap text-center text-[--tick-color]">Primary Background</div>
      <p className="bodyL2Regular text-palette-gray-800">{formState.content}</p>
      <div className="title3Bold">Hover Primary Low Background</div>
      <div className="caption2Regular">Focus Primary Low Background</div>
      <div className="[&>section_h2]:subtitle1Bold">Focus Primary Low Background</div>
      <h3 className={cn('subtitle1Bold', className)} {...props} />
      <h3 className={isDisabled ? 'subtitle1Regular' : 'subtitle1Bold'} {...props} />
      <p className="caption2Regular text-palette-gray-800">{description}</p>
      <div className="text-caption1Bold">Text with prefix</div>
      <span className="text-bodyL2Regular">Another text with prefix</span>
      <h2 className="text-title3Bold">Title with prefix</h2>
    </div>
  );
}
