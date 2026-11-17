"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock3,
  ChevronDown,
ChevronUp,
  Droplets,
  RotateCcw,
  ShieldCheck,
  Thermometer,
  Weight,
  X,
} from "lucide-react";

import {
  nursingCalculators,
  calculatorCategories,
  type CalculatorId,
} from "@/data/mock/dashboard/calculators";

type CalculatorValues = Record<string, string>;

interface CalculationResult {
  value: string;
  unit: string;
  formula: string;
  breakdown: string[];
}

const initialValues: CalculatorValues = {
  desiredDose: "",
  availableDose: "",
  availableQuantity: "1",
  volume: "",
  dropFactor: "20",
  time: "",
  hours: "",
  weightValue: "",
  weightUnit: "kg",
  temperatureValue: "",
  temperatureDirection: "C_TO_F",
  intake: "",
  output: "",
};

function formatNumber(value: number, decimals = 2) {
  return Number(value.toFixed(decimals)).toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
}

function calculate(
  calculatorId: CalculatorId,
  values: CalculatorValues,
): CalculationResult | null {
  const number = (key: string) => Number(values[key]);

  switch (calculatorId) {
    case "dosage": {
      const desired = number("desiredDose");
      const available = number("availableDose");
      const quantity = number("availableQuantity");

      if (
        !Number.isFinite(desired) ||
        !Number.isFinite(available) ||
        !Number.isFinite(quantity) ||
        desired <= 0 ||
        available <= 0 ||
        quantity <= 0
      ) {
        return null;
      }

      const result = (desired / available) * quantity;

      return {
        value: formatNumber(result, 3),
        unit: "units",
        formula: "(Desired dose ÷ Available dose) × Quantity",
        breakdown: [
          `Desired dose: ${desired}`,
          `Available dose: ${available}`,
          `Available quantity: ${quantity}`,
          `(${desired} ÷ ${available}) × ${quantity} = ${formatNumber(result, 3)}`,
        ],
      };
    }

    case "iv-flow": {
      const volume = number("volume");
      const dropFactor = number("dropFactor");
      const time = number("time");

      if (
        !Number.isFinite(volume) ||
        !Number.isFinite(dropFactor) ||
        !Number.isFinite(time) ||
        volume <= 0 ||
        dropFactor <= 0 ||
        time <= 0
      ) {
        return null;
      }

      const result = (volume * dropFactor) / time;

      return {
        value: formatNumber(result, 0),
        unit: "gtt/min",
        formula: "(Volume in mL × Drop factor) ÷ Time in minutes",
        breakdown: [
          `Volume: ${volume} mL`,
          `Drop factor: ${dropFactor} gtt/mL`,
          `Time: ${time} minutes`,
          `(${volume} × ${dropFactor}) ÷ ${time} = ${formatNumber(result, 2)}`,
          `Rounded to the nearest whole drop: ${formatNumber(result, 0)} gtt/min`,
        ],
      };
    }

    case "iv-infusion": {
      const volume = number("volume");
      const hours = number("hours");

      if (
        !Number.isFinite(volume) ||
        !Number.isFinite(hours) ||
        volume <= 0 ||
        hours <= 0
      ) {
        return null;
      }

      const result = volume / hours;

      return {
        value: formatNumber(result, 2),
        unit: "mL/hr",
        formula: "Total volume ÷ Time in hours",
        breakdown: [
          `Total volume: ${volume} mL`,
          `Infusion duration: ${hours} hours`,
          `${volume} ÷ ${hours} = ${formatNumber(result, 2)} mL/hr`,
        ],
      };
    }

    case "weight": {
      const value = number("weightValue");
      const unit = values.weightUnit;

      if (!Number.isFinite(value) || value < 0) return null;

      let result = 0;
      let resultUnit = "";

      switch (unit) {
        case "kg":
          result = value * 2.20462;
          resultUnit = "lb";
          break;
        case "lb":
          result = value / 2.20462;
          resultUnit = "kg";
          break;
        case "g":
          result = value / 1000;
          resultUnit = "kg";
          break;
        case "mg":
          result = value / 1000000;
          resultUnit = "kg";
          break;
        default:
          return null;
      }

      return {
        value: formatNumber(result, 4),
        unit: resultUnit,
        formula: "Unit conversion",
        breakdown: [
          `Original measurement: ${value} ${unit}`,
          `Converted measurement: ${formatNumber(result, 4)} ${resultUnit}`,
        ],
      };
    }

    case "temperature": {
      const value = number("temperatureValue");

      if (!Number.isFinite(value)) return null;

      const direction = values.temperatureDirection;

      const result =
        direction === "C_TO_F"
          ? (value * 9) / 5 + 32
          : ((value - 32) * 5) / 9;

      return {
        value: formatNumber(result, 2),
        unit: direction === "C_TO_F" ? "°F" : "°C",
        formula:
          direction === "C_TO_F"
            ? "(°C × 9/5) + 32"
            : "(°F − 32) × 5/9",
        breakdown: [
          `Original temperature: ${value}${direction === "C_TO_F" ? "°C" : "°F"}`,
          `Converted temperature: ${formatNumber(result, 2)}${direction === "C_TO_F" ? "°F" : "°C"}`,
        ],
      };
    }

    case "fluid-balance": {
      const intake = number("intake");
      const output = number("output");

      if (
        !Number.isFinite(intake) ||
        !Number.isFinite(output) ||
        intake < 0 ||
        output < 0
      ) {
        return null;
      }

      const result = intake - output;

      return {
        value: `${result > 0 ? "+" : ""}${formatNumber(result, 2)}`,
        unit: "mL",
        formula: "Total intake − Total output",
        breakdown: [
          `Total fluid intake: ${intake} mL`,
          `Total fluid output: ${output} mL`,
          `${intake} − ${output} = ${formatNumber(result, 2)} mL`,
        ],
      };
    }

    default:
      return null;
  }
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder = "Enter value",
  unit,
  min = 0,
  step = 1,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  min?: number;
  step?: number;
}) {
  const adjustValue = (direction: "up" | "down") => {
    const currentValue = value === "" ? 0 : Number(value);

    if (!Number.isFinite(currentValue)) return;

    const nextValue =
      direction === "up"
        ? currentValue + step
        : currentValue - step;

    onChange(String(Math.max(min, Number(nextValue.toFixed(6)))));
  };

  return (
    <label className="block space-y-2">
      <span className="dashboard-card-title text-sm font-semibold">
        {label}
      </span>

      <div className="calculator-input-wrapper relative">
        <input
          type="number"
          min={min}
          step="any"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="calculator-number-input dashboard-search w-full rounded-xl px-4 py-3 text-sm outline-none transition focus:border-[#5B3DF5]"
        />

        {unit && (
          <span className="calculator-input-unit pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-xs font-semibold">
            {unit}
          </span>
        )}

        <div className="calculator-spinner absolute right-2 top-1/2 flex -translate-y-1/2 flex-col">
          <button
            type="button"
            aria-label={`Increase ${label}`}
            onClick={() => adjustValue("up")}
            className="calculator-spinner-button flex h-5 w-7 items-center justify-center rounded-t-md"
          >
            <ChevronUp size={14} />
          </button>

          <button
            type="button"
            aria-label={`Decrease ${label}`}
            onClick={() => adjustValue("down")}
            className="calculator-spinner-button flex h-5 w-7 items-center justify-center rounded-b-md"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block space-y-2">
      <span className="dashboard-card-title text-sm font-semibold">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="dashboard-search w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5B3DF5]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] =
    useState<CalculatorId>("dosage");

  const [activeCategory, setActiveCategory] =
    useState("All Calculators");

  const [values, setValues] = useState<CalculatorValues>(initialValues);

  const [showBreakdown, setShowBreakdown] = useState(true);

  const selectedCalculator = nursingCalculators.find(
    (item) => item.id === activeCalculator,
  )!;

  const result = useMemo(
    () => calculate(activeCalculator, values),
    [activeCalculator, values],
  );

  const displayedCalculators =
    activeCategory === "All Calculators"
      ? nursingCalculators
      : nursingCalculators.filter(
          (item) => item.category === activeCategory,
        );

  const updateValue = (key: string, value: string) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const selectCalculator = (id: CalculatorId) => {
    setActiveCalculator(id);
    setValues(initialValues);
  };

  const resetCalculator = () => {
    setValues(initialValues);
  };

  return (
    <div className="dashboard-content mx-auto w-full min-w-0 max-w-[1440px] space-y-9 px-4 py-2 sm:px-6 lg:px-8">
      {/* PAGE INTRODUCTION */}
      <section className="flex flex-col items-center px-2 pb-2 pt-3 text-center sm:pt-5">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EBFF] text-[#5B3DF5]">
          <Calculator size={23} />
        </div>

        <span className="dashboard-section-label">
          CLINICAL CALCULATION TOOLS
        </span>

        <h1 className="dashboard-heading mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[42px]">
          Nursing Calculators
        </h1>

        <p className="dashboard-muted mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base">
          Practical calculation tools to help you practise dosage
          calculations, IV therapy, fluid balance and essential nursing
          conversions.
        </p>

        <div className="dashboard-muted mt-5 flex items-center gap-2 text-xs sm:text-sm">
          <span>Resources</span>
          <span>/</span>
          <span className="dashboard-heading font-semibold">
            Calculators
          </span>
        </div>
      </section>

      {/* SAFETY NOTICE */}
      <section className="calculator-safety-notice flex gap-3 rounded-2xl p-4 sm:p-5">
  <AlertTriangle
    size={21}
    className="calculator-safety-icon mt-0.5 shrink-0"
  />

  <div>
    <h2 className="calculator-safety-title text-sm font-bold">
      Clinical verification required
    </h2>

    <p className="calculator-safety-description mt-1 text-xs leading-6 sm:text-sm">
      These calculators are educational tools for nursing practice.
      Always verify calculations independently, follow the
      prescribed order, and adhere to institutional policies and
      clinical protocols before administering medication or fluids.
    </p>
  </div>
</section>

      {/* CALCULATOR FILTERS */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="dashboard-heading text-xl font-bold">
              Choose a calculator
            </h2>
            <p className="dashboard-muted mt-1 text-sm">
              Select a tool to get started.
            </p>
          </div>

          <span className="dashboard-count-badge w-fit rounded-full px-3 py-1.5 text-xs font-semibold">
            {nursingCalculators.length} tools available
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {calculatorCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeCategory === category
                  ? "bg-[#5B3DF5] text-white shadow-md shadow-violet-200"
                  : "dashboard-inner-card dashboard-muted hover:border-[#8D7AF5]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayedCalculators.map((calculator) => {
            const Icon = calculator.icon;
            const active = calculator.id === activeCalculator;

            return (
              <button
                key={calculator.id}
                type="button"
                onClick={() => selectCalculator(calculator.id)}
                className={`dashboard-card flex h-full flex-col rounded-2xl p-5 text-left transition ${
                  active
                    ? "border-[#8D7AF5] ring-2 ring-[#5B3DF5]/15"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="dashboard-soft-icon flex h-11 w-11 items-center justify-center rounded-xl">
                    <Icon size={21} />
                  </div>

                  {active && (
                    <span className="rounded-full bg-[#F0EBFF] px-2.5 py-1 text-[10px] font-bold text-[#5B3DF5]">
                      SELECTED
                    </span>
                  )}
                </div>

                <h3 className="dashboard-card-title mt-4 text-base font-bold">
                  {calculator.title}
                </h3>

                <p className="dashboard-card-description mt-2 flex-1 text-sm leading-6">
                  {calculator.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="dashboard-muted text-[11px] font-semibold">
                    {calculator.category}
                  </span>

                  <ArrowRight
                    size={17}
                    className="dashboard-accent-icon"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ACTIVE CALCULATOR */}
      <section
        className="dashboard-card overflow-hidden rounded-2xl"
        id="calculator-workspace"
      >
        <div className="border-b border-[var(--dash-border)] p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="dashboard-soft-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                {activeCalculator === "dosage" && (
                  <Calculator size={23} />
                )}
                {activeCalculator === "iv-flow" && (
                  <Droplets size={23} />
                )}
                {activeCalculator === "iv-infusion" && (
                  <Clock3 size={23} />
                )}
                {activeCalculator === "weight" && (
                  <Weight size={23} />
                )}
                {activeCalculator === "temperature" && (
                  <Thermometer size={23} />
                )}
                {activeCalculator === "fluid-balance" && (
                  <Activity size={23} />
                )}
              </div>

              <div>
                <span className="dashboard-muted text-[10px] font-bold uppercase tracking-widest">
                  {selectedCalculator.category}
                </span>

                <h2 className="dashboard-heading mt-1 text-xl font-bold sm:text-2xl">
                  {selectedCalculator.title}
                </h2>

                <p className="dashboard-muted mt-1 max-w-xl text-sm leading-6">
                  {selectedCalculator.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetCalculator}
              className="dashboard-inner-card flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition hover:border-[#8D7AF5]"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 p-5 sm:p-7 lg:grid-cols-2 lg:gap-10">
          {/* INPUTS */}
          <div className="space-y-5">
            <div>
              <h3 className="dashboard-heading font-bold">
                Enter your values
              </h3>
              <p className="dashboard-muted mt-1 text-xs">
                Fill in the required fields below.
              </p>
            </div>

            {activeCalculator === "dosage" && (
              <div className="space-y-4">
                <NumberInput
                  label="Desired dose"
                  value={values.desiredDose}
                  onChange={(v) => updateValue("desiredDose", v)}
                  unit="mg"
                />

                <NumberInput
                  label="Available dose"
                  value={values.availableDose}
                  onChange={(v) => updateValue("availableDose", v)}
                  unit="mg"
                />

                <NumberInput
                  label="Available quantity"
                  value={values.availableQuantity}
                  onChange={(v) => updateValue("availableQuantity", v)}
                  unit="tablets / mL"
                />

                <p className="dashboard-muted text-xs leading-5">
                  Ensure the desired and available doses use the same
                  measurement unit. The result is expressed in the
                  available quantity unit.
                </p>
              </div>
            )}

            {activeCalculator === "iv-flow" && (
              <div className="space-y-4">
                <NumberInput
                  label="Total volume"
                  value={values.volume}
                  onChange={(v) => updateValue("volume", v)}
                  unit="mL"
                />

                <NumberInput
                  label="Drop factor"
                  value={values.dropFactor}
                  onChange={(v) => updateValue("dropFactor", v)}
                  unit="gtt/mL"
                />

                <NumberInput
                  label="Infusion time"
                  value={values.time}
                  onChange={(v) => updateValue("time", v)}
                  unit="minutes"
                />

                <p className="dashboard-muted text-xs leading-5">
                  Use the drop factor printed on the IV administration
                  set. Different sets have different drop factors.
                </p>
              </div>
            )}

            {activeCalculator === "iv-infusion" && (
              <div className="space-y-4">
                <NumberInput
                  label="Total infusion volume"
                  value={values.volume}
                  onChange={(v) => updateValue("volume", v)}
                  unit="mL"
                />

                <NumberInput
                  label="Infusion duration"
                  value={values.hours}
                  onChange={(v) => updateValue("hours", v)}
                  unit="hours"
                />

                <p className="dashboard-muted text-xs leading-5">
                  Enter the infusion duration in hours. For example,
                  30 minutes should be entered as 0.5 hours.
                </p>
              </div>
            )}

            {activeCalculator === "weight" && (
              <div className="space-y-4">
                <NumberInput
                  label="Weight measurement"
                  value={values.weightValue}
                  onChange={(v) => updateValue("weightValue", v)}
                  placeholder="Enter weight"
                />

                <SelectInput
                  label="Convert from"
                  value={values.weightUnit}
                  onChange={(v) => updateValue("weightUnit", v)}
                  options={[
                    { label: "Kilograms (kg)", value: "kg" },
                    { label: "Pounds (lb)", value: "lb" },
                    { label: "Grams (g)", value: "g" },
                    { label: "Milligrams (mg)", value: "mg" },
                  ]}
                />
              </div>
            )}

            {activeCalculator === "temperature" && (
              <div className="space-y-4">
                <NumberInput
                  label="Temperature"
                  value={values.temperatureValue}
                  onChange={(v) =>
                    updateValue("temperatureValue", v)
                  }
                  placeholder="Enter temperature"
                />

                <SelectInput
                  label="Conversion direction"
                  value={values.temperatureDirection}
                  onChange={(v) =>
                    updateValue("temperatureDirection", v)
                  }
                  options={[
                    {
                      label: "Celsius → Fahrenheit",
                      value: "C_TO_F",
                    },
                    {
                      label: "Fahrenheit → Celsius",
                      value: "F_TO_C",
                    },
                  ]}
                />
              </div>
            )}

            {activeCalculator === "fluid-balance" && (
              <div className="space-y-4">
                <NumberInput
                  label="Total fluid intake"
                  value={values.intake}
                  onChange={(v) => updateValue("intake", v)}
                  unit="mL"
                />

                <NumberInput
                  label="Total fluid output"
                  value={values.output}
                  onChange={(v) => updateValue("output", v)}
                  unit="mL"
                />

                <p className="dashboard-muted text-xs leading-5">
                  Enter the recorded intake and output for the same
                  observation period.
                </p>
              </div>
            )}

            <div className="dashboard-inner-card rounded-xl p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck
                  size={17}
                  className="dashboard-accent-icon mt-0.5 shrink-0"
                />
                <p className="dashboard-muted text-xs leading-5">
                  Check that your values and units match the clinical
                  instructions before using the calculated result.
                </p>
              </div>
            </div>
          </div>

          {/* RESULT */}
          <div className="flex flex-col">
            <div className="dashboard-inner-card flex flex-1 flex-col rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="dashboard-heading font-bold">
                  Calculation result
                </h3>

                <span className="rounded-full bg-[#E8F8EF] px-3 py-1 text-[10px] font-bold text-[#198754]">
                  LIVE RESULT
                </span>
              </div>

              {result ? (
                <>
                  <div className="my-7 rounded-2xl bg-gradient-to-br from-[#4930D1] to-[#7258F5] p-6 text-center text-white shadow-lg shadow-violet-200/40">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/75">
                      Calculated value
                    </p>

                    <div className="mt-3 flex flex-wrap items-baseline justify-center gap-2">
                      <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        {result.value}
                      </span>

                      <span className="text-base font-semibold text-white/85">
                        {result.unit}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-white/80">
                      <CheckCircle2 size={14} />
                      Calculation completed
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="flex w-full items-center justify-between py-2 text-left"
                  >
                    <span className="dashboard-heading text-sm font-bold">
                      Calculation breakdown
                    </span>

                    <ArrowDown
                      size={17}
                      className={`dashboard-muted transition ${
                        showBreakdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showBreakdown && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="dashboard-muted text-[10px] font-bold uppercase tracking-wider">
                          Formula
                        </p>

                        <p className="calculator-formula-box mt-1 rounded-lg p-3 text-xs font-semibold leading-5">
  {result.formula}
</p>
                          
                      </div>

                      <div>
                        <p className="dashboard-muted mb-2 text-[10px] font-bold uppercase tracking-wider">
                          Steps
                        </p>

                        <div className="space-y-2">
                          {result.breakdown.map((step, index) => (
                            <div
                              key={index}
                              className="flex gap-2 text-xs leading-5"
                            >
                              <span className="dashboard-accent-icon font-bold">
                                {index + 1}.
                              </span>

                              <span className="dashboard-body">
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                  <div className="dashboard-soft-icon flex h-16 w-16 items-center justify-center rounded-2xl">
                    <ArrowLeftRight size={28} />
                  </div>

                  <h4 className="dashboard-heading mt-5 font-bold">
                    Your result will appear here
                  </h4>

                  <p className="dashboard-muted mt-2 max-w-xs text-xs leading-6">
                    Enter valid values in the calculator fields to see
                    your calculated result and step-by-step breakdown.
                  </p>
                </div>
              )}
            </div>

            <p className="dashboard-muted mt-4 text-center text-[10px] leading-5">
              Results are rounded for display. Always independently
              verify clinical calculations.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="dashboard-muted flex items-start justify-center gap-2 pb-5 text-center text-xs">
        <ShieldCheck size={15} className="mt-0.5 shrink-0" />
        <p>
          QbankNurse calculators are intended for educational practice,
          not as a substitute for professional clinical judgment.
        </p>
      </div>
    </div>
  );
}