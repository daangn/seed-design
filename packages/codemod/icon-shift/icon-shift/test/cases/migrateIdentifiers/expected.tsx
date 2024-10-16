// @ts-nocheck

export function IconDiv() {
  const notTarget = null;

  console.log(notTarget);
  console.log(NewIcon1, NewIcon2, NewIcon3);

  const ReplacedIcon = NewIcon1;

  return (
    <Fragment>
      <div>
        <NewIcon1 />
        <ReplacedIcon />
        <NewIcon2 />
        <NewIcon3>
          <div>Hello World</div>
        </NewIcon3>
        <IconNotTarget />
      </div>
      <NewIcon4 />
    </Fragment>
  );
}
