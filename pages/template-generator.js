import React, { useState, useRef, useEffect } from "react";
import {basePath} from '../next.config';
import createPersistedState from "use-persisted-state";
const usePersistedCities = createPersistedState("cities");
const usePersistedServices = createPersistedState("services");
const usePersistedTitleTemplate = createPersistedState("title-template");
const usePersistedDescriptionTemplate = createPersistedState(
  "desciption-template"
);
const usePersistedContentTemplate = createPersistedState("content-template");
import { Button, Form, Header, Card, Grid } from "semantic-ui-react";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import TagsInput from "react-tagsinput";
import TemplateCard from "../components/TemplateCard";
import { Tab } from "semantic-ui-react";
import Nav from "../components/Nav";

export default function Home() {
  const [cities, setCities] = usePersistedCities([]);
  const [services, setServices] = usePersistedServices([]);

  const [rerender, forceRerender] = useState(false);
  const [titleOutput, setTitleOutput] = useState({});
  const [descriptionOutput, setDescriptionOutput] = useState({});
  const [contentOutput, setContentOutput] = useState({});
  const [titleTemplate, setTitleTemplate] = usePersistedTitleTemplate("");
  const [
    descriptionTemplate,
    setDescriptionTemplate,
  ] = usePersistedDescriptionTemplate("");
  const [contentTemplate, setContentTemplate] = usePersistedContentTemplate("");
  useEffect(() => forceRerender(!rerender), []);
  function GenerateOutput() {
    const inputCities = cities.sort();
    const inputServices = services.sort();
    const titleOutputs = inputCities.reduce((cityCollection, city) => {
      cityCollection[city] = inputServices.reduce(
        (serviceCollection, service) => {
          let temp = titleTemplate.replaceAll("{{city}}", city);
          temp = temp.replaceAll("{{service}}", service);
          serviceCollection[service] = temp;
          return serviceCollection;
        },
        {}
      );
      return cityCollection;
    }, {});
    setTitleOutput(titleOutputs);

    const descriptionOutputs = inputCities.reduce((cityCollection, city) => {
      cityCollection[city] = inputServices.reduce(
        (serviceCollection, service) => {
          let temp = descriptionTemplate.replaceAll("{{city}}", city);
          temp = temp.replaceAll("{{service}}", service);
          serviceCollection[service] = temp;
          return serviceCollection;
        },
        {}
      );
      return cityCollection;
    }, {});
    setDescriptionOutput(descriptionOutputs);

    const contentOutputs = inputCities.reduce((cityCollection, city) => {
      cityCollection[city] = inputServices.reduce(
        (serviceCollection, service) => {
          let temp = contentTemplate.replaceAll("{{city}}", city);
          temp = temp.replaceAll("{{service}}", service);
          serviceCollection[service] = temp;
          return serviceCollection;
        },
        {}
      );
      return cityCollection;
    }, {});
    setContentOutput(contentOutputs);
  }

  const panes = Object.keys(titleOutput).map((city, i) => {
    return {
      menuItem: city,
      render: () => (
        <Tab.Pane>
          <CityService
            key={i}
            {...{ city, titleOutput, descriptionOutput, contentOutput }}
          />
        </Tab.Pane>
      ),
    };
  });

  return (
    <div className="view-wrapper">
      <Nav title=" City Service Content Generator" />

      <div
        className="row p rounded elevated outlined"
        style={{ height: "100px" }}
      >
        <h1>Custom Workflow Enhancement Tool</h1>
      </div>
      <div className="row flex-wrap">
        <div
          className="inputs column outlined rounded p elevated flex-grow"
          style={{ minWidth: "500px" }}
        >
          <Header as="h2" content="Inputs" textAlign="center" />
          <Form>
            <div className="row flex-wrap">
              <div className="p" style={{ minWidth: "300px", maxWidth: "50%" }}>
                <h3>Cities</h3>
                <TagsInput
                  value={cities}
                  onChange={(val) =>
                    setCities(
                      val.reduce((collection, string) => {
                        const splitString = string.split(", ");
                        collection.push(...splitString);
                        return collection;
                      }, [])
                    )
                  }
                  inputProps={{ placeholder: "Add a City" }}
                  onlyUnique
                />
              </div>
              <div className="p" style={{ minWidth: "300px", maxWidth: "50%" }}>
                <h3>Services</h3>
                <TagsInput
                  value={services}
                  onChange={(val) =>
                    setServices(
                      val.reduce((collection, string) => {
                        const splitString = string.split(", ");
                        collection.push(...splitString);
                        return collection;
                      }, [])
                    )
                  }
                  // onChange={(val) => setServices(val)}
                  inputProps={{ placeholder: "Add a Service" }}
                />
              </div>
            </div>
            <div className="row flex-wrap">
              <div className="column flex-grow" style={{ maxWidth: "500px" }}>
                <h2>Title Template</h2>
                <textarea
                  style={{ width: "100%" }}
                  value={titleTemplate}
                  onChange={({ target: { value } }) => setTitleTemplate(value)}
                  placeholder="Template replaces {{service}} and {{city}}"
                />
              </div>
              <div className="column flex-grow" style={{ maxWidth: "500px" }}>
                <h2>Description Template</h2>
                <textarea
                  style={{ width: "100%" }}
                  value={descriptionTemplate}
                  onChange={({ target: { value } }) =>
                    setDescriptionTemplate(value)
                  }
                  placeholder="Template replaces {{service}} and {{city}}"
                />
              </div>
              <div className="column flex-grow" style={{ maxWidth: "500px" }}>
                <h2>Content Template</h2>
                <textarea
                  style={{ width: "100%" }}
                  value={contentTemplate}
                  onChange={({ target: { value } }) =>
                    setContentTemplate(value)
                  }
                  placeholder="Template replaces {{service}} and {{city}}"
                />
              </div>
            </div>
            <div className="row p elevated rounded">
              <Button positive onClick={GenerateOutput}>
                {titleOutput && Object.keys(titleOutput).length > 0
                  ? "Regenerate Outputs"
                  : "Generate Outputs"}
              </Button>
              <Button
                negative
                onClick={() => {
                  setTitleOutput({});
                  setDescriptionOutput({});
                  setContentOutput({});
                  setCities([]);
                  setTitleTemplate("");
                  setDescriptionTemplate("");
                  setContentTemplate("");
                  setServices([]);
                }}
              >
                Clear
              </Button>
            </div>
          </Form>
        </div>
        {titleOutput && Object.keys(titleOutput).length > 0 && (
          <div
            className="outputs outlined rounded column p elevated flex-grow"
            style={{ minWidth: "500px" }}
          >
            <Header as="h2" content="Outputs" textAlign="center" />

            <div className="column p elevated">
              <Tab
                menu={{
                  fluid: true,
                  pointing: true,
                  tabular: true,
                  color: "teal",
                  inverted: true,
                }}
                panes={panes}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CityService({ city, titleOutput, descriptionOutput, contentOutput }) {
  const panes = Object.keys(titleOutput[city]).map((service, index) => {
    return {
      menuItem: service,
      render: () => (
        <Tab.Pane>
          <TemplateCard
            key={index}
            index={(index += 1)}
            city={city}
            service={service}
            title={titleOutput[city][service]}
            description={descriptionOutput[city][service]}
            content={contentOutput[city][service]}
          />
        </Tab.Pane>
      ),
    };
  });
  return (
    <div className="column" key={city}>
      <div className="row flex-wrap">
        <Tab
          menu={{
            vertical: true,
            pointing: false,
            tabular: false,
            inverted: true,
            color: "blue",
          }}
          panes={panes}
        />
      </div>
    </div>
  );
}
