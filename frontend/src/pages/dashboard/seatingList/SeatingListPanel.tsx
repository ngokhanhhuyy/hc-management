import React, { useState } from "react";
import { useNavigate } from "react-router";
import type { SeatingBasicModel } from "#/models";
import { getSeatingOrderUpsertRoutePath, joinClassName } from "#/helpers";

// Child components.
import { MagnifyingGlassIcon, XMarkIcon, Squares2X2Icon, Bars4Icon } from "@heroicons/react/24/outline";
import SeatingListItem from "./SeatingListItem";
import { Form, FormField, TextInput } from "#/components/form";

// Props.
type SeatingListPanelProps = {
  model: SeatingBasicModel[];
};

// Components.
export default function SeatingListPanel(props: SeatingListPanelProps): React.ReactNode {
  // Dependencies.
  const navigate = useNavigate();

  // States.
  const [searchContent, setSearchContent] = useState<string>("");

  // Templates.
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-header-title">
          Danh sách bàn ăn
        </span>
      </div>

      <div className="panel-body flex flex-col">
        <div className="p-3 border-b border-black/10">
          <div className="panel-body-area grid grid-cols-[1fr_auto] gap-3 p-3">
            <FormField path="searchContent">
              <div className="form-input-group group">
                <span className="form-input-group-text px-2">
                  <MagnifyingGlassIcon className="size-4.5" />
                </span>

                <TextInput
                  className={joinClassName("z-0", searchContent && "not-focus:border-e-transparent")}
                  value={searchContent}
                  onInput={setSearchContent}
                />

                {searchContent && (
                  <button
                    type="button"
                    className="btn btn-danger-outline group-has-[input:focus]:border-s-transparent"
                    onClick={() => setSearchContent("")}
                  >
                    <XMarkIcon />
                  </button>
                )}
              </div>
            </FormField>
          </div>
        </div>

        <div className="grid xl:grid-cols-5 lg:grid-cols-4 items-start gap-3 p-3">
          {props.model.map((seating) => (
            <SeatingListItem
              model={seating}
              onClick={() => navigate(getSeatingOrderUpsertRoutePath(seating.id))}
              key={seating.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
