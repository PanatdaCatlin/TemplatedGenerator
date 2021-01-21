import React, { useState, useRef, useEffect } from "react";
import createPersistedState from "use-persisted-state";
const usePersistedCities = createPersistedState("cities");
const usePersistedServices = createPersistedState("services");
const usePersistedTitleTemplate = createPersistedState("title-template");
const usePersistedDescriptionTemplate = createPersistedState(
  "desciption-template"
);
const usePersistedContentTemplate = createPersistedState("content-template");
import { Container, Button, Form, Header, Card, Grid } from "semantic-ui-react";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import TagsInput from "react-tagsinput";
import TemplateCard from '../components/TemplateCard';

export default function Home() {
  const [cities, setCities] = usePersistedCities([]);
  const [services, setServices] = usePersistedServices([]);

  const [titleOutput, setTitleOutput] = useState({});
  const [rerender, forceRerender] = useState(false);
  const [descriptionOutput, setDescriptionOutput] = useState({});
  const [contentOutput, setContentOutput] = useState({});
  const [titleTemplate, setTitleTemplate] = usePersistedTitleTemplate("");
  const [
    descriptionTemplate,
    setDescriptionTemplate,
  ] = usePersistedDescriptionTemplate("");
  const [contentTemplate, setContentTemplate] = usePersistedContentTemplate("");
  useEffect(()=>forceRerender(!rerender),[]);
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

  return (
    <div style={{marginTop:'50px'}}>
      <Header
        as="h1"
        content="City Service Content Gerator"
        textAlign="center"
      />
      <Header
        as="h2"
        content="A PNWDesign Workflow Enhancement Tool™"
        textAlign="center"
      />
      <Container>
        <Form>
          <Form.Field>
            <label>Cities</label>
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
          </Form.Field>
          <Form.Field>
            <label>Services</label>
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
          </Form.Field>
          <Form.Field>
            <label>Title Template</label>
            <textarea
              style={{ width: "100%" }}
              value={titleTemplate}
              onChange={({ target: { value } }) => setTitleTemplate(value)}
              placeholder="Template replaces {{service}} and {{city}}"
            />
          </Form.Field>
          <Form.Field>
            <label>Description Template</label>
            <textarea
              style={{ width: "100%" }}
              value={descriptionTemplate}
              onChange={({ target: { value } }) =>
                setDescriptionTemplate(value)
              }
              placeholder="Template replaces {{service}} and {{city}}"
            />
          </Form.Field>
          <Form.Field>
            <label>Content Template</label>
            <textarea
              style={{ width: "100%" }}
              value={contentTemplate}
              onChange={({ target: { value } }) => setContentTemplate(value)}
              placeholder="Template replaces {{service}} and {{city}}"
            />
          </Form.Field>

          <Button  onClick={GenerateOutput}>
            Submit
          </Button>
          <Button
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
        </Form>
      </Container>
      
      <Container >
        {Object.keys(titleOutput).map((city, i) => {
          return (
            <Container style={{marginTop:'50px'}}>
              <Header as="h1" content={city} />
              <Grid columns={3}>
                <Grid.Row key={i}>
                  {Object.keys(titleOutput[city]).map((service, index) => {
                    return (
                      <Grid.Column key={index} style={{marginTop:'50px'}}>
                        <TemplateCard 
                          index={(index += 1)}
                          city={city}
                          service={service}
                          title={titleOutput[city][service]}
                          description={descriptionOutput[city][service]}
                          content={contentOutput[city][service]}
                        />
                        
                      </Grid.Column>
                    );
                  })}
                </Grid.Row>
              </Grid>
            </Container>
          );
        })}
      </Container>
    </div>
  );
}


