//----------Import----------
//external libraries
import React, { useContext } from "react";
import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import Select, { components } from "react-select";
import Toggle from "react-toggle";

//local components
import AppContext from "../../appContext";

//project-specific constants
import {
  careNeedsList,
  dbhList,
  gardenList,
  siteConditionsList,
} from "../../utils/constants.js";

//styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./react-toggle.css";
import styles from "./filterDrawer.module.css";

//----------Create Component----------
const FilterDrawer = ({ filteredTrees }) => {
  //access global states from parent (using Context)
  const {
    allSpecies,
    filterCriteria,
    filterOpen,
    mergedTrees,
    setFilterCriteria,
    setFilterOpen,
  } = useContext(AppContext);

  //define local states and set initial values
  const CustomValueContainer = ({ children, ...props }) => {
    const selectedOptions = props.getValue();
    const fieldName = props.selectProps.fieldName;

    if (selectedOptions.length === 1) {
      return (
        <components.ValueContainer {...props}>
          {selectedOptions[0].label}
        </components.ValueContainer>
      );
    }

    if (selectedOptions.length > 1) {
      return (
        <components.ValueContainer {...props}>
          Multiple {fieldName}
        </components.ValueContainer>
      );
    }

    //no selections
    return (
      <components.ValueContainer {...props}>
        {children}
      </components.ValueContainer>
    );
  };
  const columnCount = 2;
  const siteConditionsColumns = Array.from(
    { length: columnCount },
    (_, colIndex) =>
      siteConditionsList.filter((_, i) => i % columnCount === colIndex),
  );

  //handlers and callback functions
  //handle typeahead controls
  const handleTypeaheadChange = (selectedOptions, fieldName) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    let fullOptionList;
    if (fieldName === "commonName") {
      fullOptionList = allSpecies.map((species) => species.commonName);
    } else if (fieldName === "dbh") {
      fullOptionList = dbhList;
    } else if (fieldName === "garden") {
      fullOptionList = gardenList;
    }

    //handle "select all" option
    if (selectedValues.includes("__ALL__")) {
      setFilterCriteria((prev) => ({
        ...prev,
        [fieldName]: fullOptionList,
      }));
      return;
    }

    //handle individual options
    setFilterCriteria((prev) => ({
      ...prev,
      [fieldName]: selectedValues,
    }));
  };

  //handle changes to filter criteria
  const handleFilterChange = (event, category = null) => {
    const { name, type, value, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFilterCriteria((prev) => {
      //nested toggles for careNeeds and siteConditions
      if (category) {
        return {
          ...prev,
          [category]: {
            ...(prev[category] || {}),
            [name]: newValue,
          },
        };
      } else {
        //top-level toggles
        return {
          ...prev,
          [name]: newValue,
        };
      }
    });
  };

  //----------Render Component----------
  return (
    <Offcanvas
      backdrop={false}
      className={styles.drawer}
      id="filter-drawer"
      onHide={() => {
        setFilterOpen(false);
      }}
      placement="end"
      scroll={true}
      show={filterOpen}
    >
      <Offcanvas.Title className="ms-3 mb-3">Filter</Offcanvas.Title>

      <Offcanvas.Body>
        <Row>
          <legend className="text-white h6">Tree Profile</legend>
          <p style={{ fontSize: "0.8rem" }}>
            Include trees with these characteristics
          </p>
          <Select
            closeMenuOnSelect={false}
            components={{
              ValueContainer: CustomValueContainer,
            }}
            fieldName="names"
            hideSelectedOptions={false}
            isMulti
            onChange={(selectedOptions) =>
              handleTypeaheadChange(selectedOptions, "commonName")
            }
            options={[
              { label: "[Show All]", value: "__ALL__" },
              ...[...allSpecies]
                .sort((a, b) => a.commonName.localeCompare(b.commonName))
                .map((species) => ({
                  label: species.commonName,
                  value: species.commonName,
                })),
            ]}
            placeholder="Filter by species..."
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "white",
                borderColor: "#ccc",
                color: "black",
              }),
              option: (base, { isSelected }) => ({
                ...base,
                backgroundColor: isSelected ? "var(--pale-yellow)" : "white",
                color: "black",
              }),
            }}
            value={allSpecies
              .filter((species) =>
                filterCriteria.commonName?.includes(species.commonName),
              )
              .map((species) => ({
                label: species.commonName,
                value: species.commonName,
              }))}
          />

          <Select
            className="mt-1"
            clearButton="true"
            closeMenuOnSelect={false}
            components={{
              ValueContainer: CustomValueContainer,
            }}
            fieldName="diameters"
            hideSelectedOptions={false}
            isMulti
            onChange={(selectedOptions) =>
              handleTypeaheadChange(selectedOptions, "dbh")
            }
            options={[
              { label: "[Show All]", value: "__ALL__" },
              ...dbhList.map((dbh) => ({
                label: dbh,
                value: dbh,
              })),
            ]}
            placeholder="Filter by diameter..."
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "white",
                borderColor: "#ccc",
                color: "black",
              }),
              option: (base, { isSelected }) => ({
                ...base,
                backgroundColor: isSelected ? "var(--pale-yellow)" : "white",
                color: "black",
              }),
            }}
            value={dbhList
              .filter((dbh) => filterCriteria.dbh?.includes(dbh))
              .map((dbh) => ({
                label: dbh,
                value: dbh,
              }))}
          />

          <Select
            className="mt-1"
            closeMenuOnSelect={false}
            components={{
              ValueContainer: CustomValueContainer,
            }}
            fieldName="gardens"
            hideSelectedOptions={false}
            isMulti
            onChange={(selectedOptions) =>
              handleTypeaheadChange(selectedOptions, "garden")
            }
            options={[
              { label: "[Show All]", value: "__ALL__" },
              ...gardenList.map((garden) => ({
                label: garden,
                value: garden,
              })),
            ]}
            placeholder="Filter by garden..."
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "white",
                borderColor: "#ccc",
                color: "black",
              }),
              option: (base, { isSelected }) => ({
                ...base,
                backgroundColor: isSelected ? "var(--pale-yellow)" : "white",
                color: "black",
              }),
            }}
            value={gardenList
              .filter((garden) => filterCriteria.garden?.includes(garden))
              .map((garden) => ({
                label: garden,
                value: garden,
              }))}
          />

          <label key="multistem">
            <Toggle
              className="mt-2"
              checked={!!filterCriteria.multistem}
              icons={false}
              onChange={(event) => {
                handleFilterChange({
                  target: {
                    name: "multistem",
                    type: "checkbox",
                    checked: event.target.checked,
                  },
                });
              }}
            />
            <span className="filterToggle">Multistem</span>
          </label>

          <label key="nonnative">
            <Toggle
              checked={!!filterCriteria.nonnative}
              icons={false}
              onChange={(event) => {
                handleFilterChange({
                  target: {
                    name: "nonnative",
                    type: "checkbox",
                    checked: event.target.checked,
                  },
                });
              }}
            />
            <span className="filterToggle">Nonnative</span>
          </label>

          <label key="invasive">
            <Toggle
              checked={!!filterCriteria.invasive}
              icons={false}
              onChange={(event) => {
                handleFilterChange({
                  target: {
                    name: "invasive",
                    type: "checkbox",
                    checked: event.target.checked,
                  },
                });
              }}
            />
            <span className="filterToggle">Invasive</span>
          </label>
        </Row>

        <Row className="mt-3">
          <legend className="text-white h6">Care Needs</legend>
          <p style={{ fontSize: "0.8rem" }}>
            Include trees with care-need flags
          </p>
          {careNeedsList.map((need) => (
            <label key={need}>
              <Toggle
                checked={!!filterCriteria.careNeeds?.[need]}
                icons={false}
                onChange={(event) =>
                  handleFilterChange(
                    {
                      target: {
                        name: need,
                        type: "checkbox",
                        checked: event.target.checked,
                      },
                    },
                    "careNeeds",
                  )
                }
              />
              <span className="filterToggle">
                {need
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </span>
            </label>
          ))}
          <label key="noCareNeedFlags">
            <Toggle
              checked={!!filterCriteria.careNeeds?.noCareNeedFlags}
              icons={false}
              onChange={(event) => {
                handleFilterChange(
                  {
                    target: {
                      name: "noCareNeedFlags",
                      type: "checkbox",
                      checked: event.target.checked,
                    },
                  },
                  "careNeeds",
                );
              }}
            />
            <span className="filterToggle">No Care-Need Flags</span>
          </label>
        </Row>
        <Row className="mt-3">
          <legend className="text-white h6">Site Info</legend>
          <p style={{ fontSize: "0.8rem" }}>
            Include trees with site-condition flags
          </p>
          {siteConditionsList.map((condition) => (
            <label key={condition}>
              <Toggle
                checked={!!filterCriteria.siteConditions?.[condition]}
                icons={false}
                onChange={(event) =>
                  handleFilterChange(
                    {
                      target: {
                        name: condition,
                        type: "checkbox",
                        checked: event.target.checked,
                      },
                    },
                    "siteConditions",
                  )
                }
              />
              <span className="filterToggle">
                {condition
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </span>
            </label>
          ))}
          <label key="noSiteConditionFlags">
            <Toggle
              checked={!!filterCriteria.siteConditions?.noSiteConditionFlags}
              icons={false}
              onChange={(event) => {
                handleFilterChange(
                  {
                    target: {
                      name: "noSiteConditionFlags",
                      type: "checkbox",
                      checked: event.target.checked,
                    },
                  },
                  "siteConditions",
                );
              }}
            />
            <span className="filterToggle">No Site-Condition Flags</span>
          </label>
        </Row>
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "10px",
            color: "var(--pale-yellow)",
            fontSize: "12px",
          }}
        >
          {filteredTrees.length} / {mergedTrees.length}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FilterDrawer;
