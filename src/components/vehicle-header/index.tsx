const VehicleHeader = () => {
  return (
    <div
      className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-muted text-muted-foreground text-xs font-medium rounded-t-lg"
      role="row"
    >
      <div className="w-[30%]" role="columnheader">
        Vehicle (VIN)
      </div>
      <div className="w-[15%]" role="columnheader">
        Make
      </div>
      <div className="w-[15%]" role="columnheader">
        Model
      </div>
      <div className="w-[15%]" role="columnheader">
        In inventory since
      </div>
      <div className="w-[15%]" role="columnheader">
        Status
      </div>
      <div className="w-[19%] text-right" role="columnheader">
        Action
      </div>
    </div>
  );
};

export default VehicleHeader;
