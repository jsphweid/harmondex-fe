interface ResultProps {
  fileId: number;
  active: boolean;
}

export default function Result(props: ResultProps) {
  return (
    <div>
      <p>{props.active ? `${props.fileId} - ACTIVE` : props.fileId}</p>
    </div>
  );
}
