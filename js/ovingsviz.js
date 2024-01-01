export default class RehersalExplorer {
  constructor() {
    this.renderElement = null;
    this.data = null;
    this.renderPlan = null;
    this.renderSettings = {
      startDate: "2024-01-01",
      endDate: "2024-02-01"
    };
  }

  setRenderSettings(renderSettings) {
    if(Date.parse(renderSettings.startDate) > Date.parse(renderSettings.endDate)) {
      throw Error("Cannot render a timeline with start date after the end date");
    }
    this.renderSettings = renderSettings;
  }

  setRenderElement(renderElement) {
    console.log(`Trying to set render element to ${renderElement}`);
    if(!(renderElement instanceof Element)) {
      throw Error(`Cannot use a non element as render element: ${renderElement}`);
    }
    this.renderElement = renderElement;
    renderElement.replaceChildren();
  }
  
  setData(newData) {
    this.data = newData;
  }

  displayData() {
    console.warn("TODO implement display data");
  }
}
