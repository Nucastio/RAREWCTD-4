type Props = {
    white?: boolean;
}
const SubLoader: React.FC<Props> = ({white=false}): React.ReactNode => {
  return (
    <div className="m-auto flex h-full w-full items-center justify-center gap-5">
      {/* <div className="w-8 h-8 relative rounded-full animate-spin" style={{ backgroundImage: "conic-gradient(white 225deg, #ffffff10 90deg, #01020d)" }}> */}
      <div
        className="relative h-6 w-6 animate-spin rounded-full"
        style={{
          backgroundImage:
            `conic-gradient(${white ? "#fff" : "#d1d5db"} 120deg, #00000010 120deg, black)`,
        }}
      >
        <div className={`absolute inset-[3px] rounded-full ${white ? "bg-white" : "bg-primary"}`} />
      </div>
    </div>
  );
};

export default SubLoader;

