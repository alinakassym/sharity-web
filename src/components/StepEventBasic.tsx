import type { FC } from "react";
import EventCategoryPicker from "@/components/EventCategoryPicker";
import EventTypePicker from "@/components/EventTypePicker";
import DatePicker from "@/components/DatePicker";
import TimePicker from "@/components/TimePicker";
import { CustomTextField } from "@/components/CustomTextField";

type SelectOption = { value: string; label: string };

interface StepEventBasicProps {
  eventName: string;
  onEventNameChange: (value: string) => void;

  eventType: string;
  onEventTypeChange: (value: string) => void;
  customEventType: string;
  onCustomEventTypeChange: (value: string) => void;
  eventTypeOptions: SelectOption[];
  eventTypesLoading: boolean;

  category: string;
  onCategoryChange: (value: string) => void;
  categoryOptions: SelectOption[];
  categoriesLoading: boolean;

  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;

  time: string;
  onTimeChange: (value: string) => void;
}

export const StepEventBasic: FC<StepEventBasicProps> = ({
  eventName,
  onEventNameChange,
  eventType,
  onEventTypeChange,
  customEventType,
  onCustomEventTypeChange,
  eventTypeOptions,
  eventTypesLoading,
  category,
  onCategoryChange,
  categoryOptions,
  categoriesLoading,
  date,
  onDateChange,
  time,
  onTimeChange,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <CustomTextField
        maxSymbols={50}
        label="Заголовок *"
        placeholder="Введите заголовок"
        value={eventName}
        onChange={(e) => onEventNameChange(e.target.value)}
        fullWidth
        variant="outlined"
      />

      <EventTypePicker
        value={eventType}
        onChange={onEventTypeChange}
        eventTypes={eventTypeOptions}
        isLoading={eventTypesLoading}
        customValue={customEventType}
        onCustomValueChange={onCustomEventTypeChange}
      />

      <EventCategoryPicker
        value={category}
        onChange={onCategoryChange}
        categories={categoryOptions}
        isLoading={categoriesLoading}
      />

      <DatePicker
        label="Дата события *"
        value={date}
        onChange={onDateChange}
        placeholder="Выберите дату события"
        minDate={new Date()}
      />

      <TimePicker
        label="Время события *"
        value={time}
        onChange={onTimeChange}
        placeholder="00:00"
      />
    </div>
  );
};
