// @ts-nocheck

export function IconDiv() {
  const notTarget = null;

  console.log(notTarget);
  console.log(Icon1, Icon2, Icon3);

  const ReplacedIcon = Icon1;

  return (
    <Fragment>
      <div>
        <Icon1 />
        <ReplacedIcon />
        <Icon2 />
        <Icon3>
          <div>Hello World</div>
        </Icon3>
        <IconNotTarget />
      </div>
      <Icon4 />
    </Fragment>
  );
}
