type Params = Promise<{ lng: string }>

export default function gamesLayout(
  props: {
    children: React.ReactNode;
    params: Params;
  }) {
  
    const { children } = props;

  return (
    <div className="h-full flex items-center justify-center bg-amber-100">
        {children}
    </div>
  );
};
