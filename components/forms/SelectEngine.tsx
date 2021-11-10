import { useFormContext } from "react-hook-form";
import Select from "react-select";

const AllEngines = ["ada", "baggage", "curie", "davinci"];

export default function SelectEngine({
  engines = AllEngines,
  name = "model",
  required,
}: {
  engines?: string[];
  name: string;
  required?: boolean;
}) {
  const form = useFormContext();

  const options = engines.map((engine) => ({
    label: engine,
    value: engine,
  }));

  return (
    <Select
      {...form.register(name, { required })}
      className="w-44 z-50"
      classNamePrefix="react-select"
      defaultValue={options.find(
        (option) => option.value === form.getValues()[name]
      )}
      isClearable={!required}
      escapeClearsValue
      isSearchable={false}
      onChange={(selection) => form.setValue(name, selection?.value ?? "")}
      options={options}
    />
  );
}
