import React, { useState, useRef } from "react";
import createPersistedState from "use-persisted-state";
const usePersistedCities = createPersistedState("cities");
const usePersistedServices = createPersistedState("services");
const usePersistedTemplate = createPersistedState("template");
import { Container, Button, Form, Header, Card, Grid } from "semantic-ui-react";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import TagsInput from "react-tagsinput";

const OutputCard = ({ text, service, index, city }) => {
  const textArea = useRef(null);
  const [displayText, setDisplayText] = useState(text);
  const [edited, setEdited] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <Card>
      <Card.Content header={`${index}: ${service} ${city}`} />
      <Card.Content>
        <textarea
          ref={textArea}
          value={displayText}
          onChange={(ev) => {
            setDisplayText(ev.target.value);
            setEdited(true);
          }}
        />
      </Card.Content>
      <Card.Content extra>
        <button
          onClick={() => {
            textArea.current.select();
            document.execCommand("copy");
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          }}
        >
          {copied ? "Coppied!" : "Copy"}
        </button>
        {edited && (
          <button
            onClick={() => {
              setDisplayText(text);
              setEdited(false);
            }}
          >
            Revert Changes
          </button>
        )}
      </Card.Content>
    </Card>
  );
};

export default function Home() {
  const [cities, setCities] = usePersistedCities(["Seattle", "Tacoma"]);
  const [services, setServices] = usePersistedServices([
    "wash floors",
    "clean cars",
  ]);

  const [output, setOutput] = useState({});
  const [template, setTemplate] = usePersistedTemplate(
    "We do the best {{service}} in {{city}}"
  );
  function GenerateOutput() {
    const inputCities = cities.sort();
    const inputServices = services.sort();
    const outputs = inputCities.reduce((cityCollection, city) => {
      cityCollection[city] = inputServices.reduce(
        (serviceCollection, service) => {
          let temp = template.replaceAll("{{city}}", city);
          temp = temp.replaceAll("{{service}}", service);
          serviceCollection[service] = temp;
          return serviceCollection;
        },
        {}
      );
      return cityCollection;
    }, {});
    setOutput(outputs);
  }
  return (
    <div>
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

              // addOnPaste

              // pasteSplit={(data) => {
              //   console.log(data)
              //   return data.split(", ").map((d) => d.trim());
              // }}
            />
          </Form.Field>
          <Form.Field>
            <label>Services</label>
            <TagsInput
              value={services}
              onChange={(val) => setServices(val)}
              inputProps={{ placeholder: "Add a Service" }}
            />
          </Form.Field>
          <Form.Field>
            <label>Template</label>
            <input
              value={template}
              onChange={({ target: { value } }) => setTemplate(value)}
              placeholder="Insert Template here, templates will replace {{city}}"
            />
          </Form.Field>

          <Button type="submit" onClick={GenerateOutput}>
            Submit
          </Button>
          <Button
            type="submit"
            onClick={() => {
              setOutput({});
              setCities([]);
              setTemplate("");
              setServices([]);
            }}
          >
            Clear
          </Button>
        </Form>
      </Container>
      <Container>
        {Object.keys(output).map((city, i) => {
          return (
            <Container>
              <Header as="h1" content={city} textAlign="center" />
              <Grid columns={3}>
                <Grid.Row key={i}>
                  {Object.keys(output[city]).map((service, index) => {
                    return (
                      <Grid.Column>
                        <OutputCard
                          index={(index += 1)}
                          city={city}
                          service={service}
                          text={output[city][service]}
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
