// @ts-nocheck

const Component = () => {
  return (
    <>
      <Text color="gray100" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="gray700" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="carrot100" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="carrot500" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="carrot700" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="carrot900" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="staticBlack" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="staticWhite" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color="onPrimary" variant="subtitle2Regular" className="text-ellipsis-2" />
      <Text color={isSelected ? "onPrimary" : "primary"} />
      <Text color={isSelected ? 'primary' : 'gray900'}  />
      <Text color={isSelected ? 'carrot600' : 'blue600'}  />
    </>
  );
};
