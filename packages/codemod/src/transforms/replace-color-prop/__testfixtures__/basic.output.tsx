// @ts-nocheck

const Component = () => {
  return (<>
    <Text color="palette.gray200" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.gray800" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.carrot200" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.carrot600" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.carrot700" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.carrot800" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.staticBlack" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.staticWhite" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color="palette.staticWhite" variant="subtitle2Regular" className="text-ellipsis-2" />
    <Text color={isSelected ? "palette.staticWhite" : "fg.brand"} />
    <Text color={isSelected ? "fg.brand" : "palette.gray1000"}  />
    <Text color={isSelected ? "palette.carrot600" : "palette.blue600"}  />
  </>);
};
