import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { TesteComponent } from "./teste/teste.component";
// var styleDrawflow = require("drawflow/dist/drawflow.min.css");

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, HelloComponent, TesteComponent],
  bootstrap: [AppComponent],
  entryComponents: [TesteComponent]
})
export class AppModule {}
