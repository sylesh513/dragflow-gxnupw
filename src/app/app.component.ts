import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TesteComponent } from "./teste/teste.component";
import Drawflow from "drawflow";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  @ViewChild(TesteComponent, { read: TemplateRef }) testeComponent: any;
  id: any = null;
  editor: any = null;
  transform: string = "";
  mobile_item_selec: string = "";
  mobile_last_move: any = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.id = document.getElementById("drawflow");
    this.editor = new Drawflow(this.id);
    this.registerEvents(this.editor);
    this.editor.reroute = true;
    this.editor.drawflow = this.drawflow();
    this.editor.start();

    const elements = document.getElementsByClassName("drag-drawflow");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("touchend", this.drop, false);
      elements[i].addEventListener("touchmove", this.positionMobile, false);
      elements[i].addEventListener("touchstart", this.drag, false);
    }
  }

  teste(): void {
    console.log("teste");
  }

  positionMobile(ev) {
    this.mobile_last_move = ev;
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    console.log("drag", ev);
    if (ev.type === "touchstart") {
      this.mobile_item_selec = ev.target
        .closest(".drag-drawflow")
        .getAttribute("data-node");
    } else {
      ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
    }
  }

  drop(ev) {
    console.log("drop", ev);
    if (ev.type === "touchend") {
      let parentdrawflow = document
        .elementFromPoint(
          this.mobile_last_move.touches[0].clientX,
          this.mobile_last_move.touches[0].clientY
        )
        .closest("#drawflow");
      if (parentdrawflow != null) {
        this.addNodeToDrawFlow(
          this.mobile_item_selec,
          this.mobile_last_move.touches[0].clientX,
          this.mobile_last_move.touches[0].clientY
        );
      }
      this.mobile_item_selec = "";
    } else {
      ev.preventDefault();
      let data = ev.dataTransfer.getData("node");
      this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }
  }

  addNodeToDrawFlow(name, pos_x, pos_y) {
    if (this.editor.editor_mode === "fixed") {
      return false;
    }
    pos_x =
      pos_x *
        (this.editor.precanvas.clientWidth /
          (this.editor.precanvas.clientWidth * this.editor.zoom)) -
      this.editor.precanvas.getBoundingClientRect().x *
        (this.editor.precanvas.clientWidth /
          (this.editor.precanvas.clientWidth * this.editor.zoom));
    pos_y =
      pos_y *
        (this.editor.precanvas.clientHeight /
          (this.editor.precanvas.clientHeight * this.editor.zoom)) -
      this.editor.precanvas.getBoundingClientRect().y *
        (this.editor.precanvas.clientHeight /
          (this.editor.precanvas.clientHeight * this.editor.zoom));

    switch (name) {
      case "facebook":
        let facebook = `
        <div>
          <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>
        </div>
        `;
        this.editor.addNode(
          "facebook",
          0,
          1,
          pos_x,
          pos_y,
          "facebook",
          {},
          facebook
        );
        break;
      case "slack":
        let slackchat = `
          <div>
            <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
          </div>
          `;
        this.editor.addNode(
          "slack",
          1,
          0,
          pos_x,
          pos_y,
          "slack",
          {},
          slackchat
        );
        break;
      case "github":
        let githubtemplate = `
          <div>
            <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
            <div class="box">
              <p>Enter repository url</p>
            <input type="text" df-name>
            </div>
          </div>
          `;
        this.editor.addNode(
          "github",
          0,
          1,
          pos_x,
          pos_y,
          "github",
          { name: "" },
          githubtemplate
        );
        break;
      case "telegram":
        let telegrambot = `
          <div>
            <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
            <div class="box">
              <p>Send to telegram</p>
              <p>select channel</p>
              <select df-channel>
                <option value="channel_1">Channel 1</option>
                <option value="channel_2">Channel 2</option>
                <option value="channel_3">Channel 3</option>
                <option value="channel_4">Channel 4</option>
              </select>
            </div>
          </div>
          `;
        this.editor.addNode(
          "telegram",
          1,
          0,
          pos_x,
          pos_y,
          "telegram",
          { channel: "channel_3" },
          telegrambot
        );
        break;
      case "aws":
        let aws = `
          <div>
            <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
            <div class="box">
              <p>Save in aws</p>
              <input type="text" df-db-dbname placeholder="DB name"><br><br>
              <input type="text" df-db-key placeholder="DB key">
              <p>Output Log</p>
            </div>
          </div>
          `;
        this.editor.addNode(
          "aws",
          1,
          1,
          pos_x,
          pos_y,
          "aws",
          { db: { dbname: "", key: "" } },
          aws
        );
        break;
      case "log":
        let log = `
            <div>
              <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
            </div>
            `;
        this.editor.addNode("log", 1, 0, pos_x, pos_y, "log", {}, log);
        break;
      case "google":
        let google = `
            <div>
              <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
            </div>
            `;
        this.editor.addNode("google", 1, 0, pos_x, pos_y, "google", {}, google);
        break;
      case "email":
        let email = `
            <div>
              <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
            </div>
            `;
        this.editor.addNode("email", 1, 0, pos_x, pos_y, "email", {}, email);
        break;

      case "template":
        let template = `
            <div>
              <div class="title-box"><i class="fas fa-code"></i> Template</div>
              <div class="box">
                Ger Vars
                <textarea df-template></textarea>
                Output template with vars
              </div>
            </div>
            `;
        this.editor.addNode(
          "template",
          1,
          1,
          pos_x,
          pos_y,
          "template",
          { template: "Write your template" },
          template
        );
        break;
      case "multiple":
        let multiple = `
            <div>
              <div class="box">
                Multiple!
              </div>
            </div>
            `;
        this.editor.addNode(
          "multiple",
          3,
          4,
          pos_x,
          pos_y,
          "multiple",
          {},
          multiple
        );
        break;
      case "personalized":
        let personalized = `
            <div>
              Personalized
            </div>
            `;
        this.editor.addNode(
          "personalized",
          1,
          1,
          pos_x,
          pos_y,
          "personalized",
          {},
          personalized
        );
        break;
      case "dbclick":
        let dbclick = `
        <div>
          <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
          <div class="box dbclickbox" [innerHTML]="'<app-teste></app-teste>'"</div>
        </div>
        `;
        // let dbclick = `
        //     <div>
        //     <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
        //       <div class="box dbclickbox" (dblclick)="showpopup($event)">
        //         Db Click here
        //         </div>
        //       </div>
        //     </div>
        //     `;
        this.editor.addNode(
          "dbclick",
          1,
          1,
          pos_x,
          pos_y,
          "dbclick",
          { name: "" },
          dbclick
        );
        break;

      default:
    }
  }

  showpopup(e) {
    console.log("SHAZAM");
    e.target.closest(".drawflow-node").style.zIndex = "9999";
    e.target.children[0].style.display = "block";
    //document.getElementById("modalfix").style.display = "block";

    //e.target.children[0].style.transform = 'translate('+translate.x+'px, '+translate.y+'px)';
    this.transform = this.editor.precanvas.style.transform;
    this.editor.precanvas.style.transform = "";
    this.editor.precanvas.style.left = this.editor.canvas_x + "px";
    this.editor.precanvas.style.top = this.editor.canvas_y + "px";
    console.log(this.transform);

    //e.target.children[0].style.top  =  -this.editor.canvas_y - this.editor.container.offsetTop +'px';
    //e.target.children[0].style.left  =  -this.editor.canvas_x  - this.editor.container.offsetLeft +'px';
    this.editor.editor_mode = "fixed";
  }

  closemodal(e) {
    e.target.closest(".drawflow-node").style.zIndex = "2";
    e.target.parentElement.parentElement.style.display = "none";
    //document.getElementById("modalfix").style.display = "none";
    this.editor.precanvas.style.transform = this.transform;
    this.editor.precanvas.style.left = "0px";
    this.editor.precanvas.style.top = "0px";
    this.editor.editor_mode = "edit";
  }

  changeModule(event) {
    let all = document.querySelectorAll(".menu ul li");
    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove("selected");
    }
    event.target.classList.add("selected");
  }

  registerEvents(editor: any): void {
    editor.on("nodeCreated", id => {
      console.log("Node created " + id);
    });

    editor.on("nodeRemoved", id => {
      console.log("Node removed " + id);
    });

    editor.on("nodeSelected", id => {
      console.log("Node selected " + id);
    });

    editor.on("moduleCreated", name => {
      console.log("Module Created " + name);
    });

    editor.on("moduleChanged", name => {
      console.log("Module Changed " + name);
    });

    editor.on("connectionCreated", connection => {
      console.log("Connection created");
      console.log(connection);
    });

    editor.on("connectionRemoved", connection => {
      console.log("Connection removed");
      console.log(connection);
    });

    editor.on("mouseMove", position => {
      // console.log("Position mouse x:" + position.x + " y:" + position.y);
    });

    editor.on("nodeMoved", id => {
      console.log("Node moved " + id);
    });

    editor.on("zoom", zoom => {
      console.log("Zoom level " + zoom);
    });

    editor.on("translate", position => {
      console.log("Translate x:" + position.x + " y:" + position.y);
    });

    editor.on("addReroute", id => {
      console.log("Reroute added " + id);
    });

    editor.on("removeReroute", id => {
      console.log("Reroute removed " + id);
    });
  }

  drawflow(): any {
    return {
      drawflow: {
        Home: {
          data: {
            "1": {
              id: 1,
              name: "welcome",
              data: {},
              class: "welcome",
              html:
                '\n    <div>\n      <div class="title-box">👏 Welcome!!</div>\n      <div class="box">\n        <p>Simple flow library <b>demo</b>\n        <a href="https://github.com/jerosoler/Drawflow" target="_blank">Drawflow</a> by <b>Jero Soler</b></p><br>\n\n        <p>Multiple input / outputs<br>\n           Data sync nodes<br>\n           Import / export<br>\n           Modules support<br>\n           Simple use<br>\n           Type: Fixed or Edit<br>\n           Events: view console<br>\n           Pure Javascript<br>\n        </p>\n        <br>\n        <p><b><u>Shortkeys:</u></b></p>\n        <p>🎹 <b>Delete</b> for remove selected<br>\n        💠 Mouse Left Click == Move<br>\n        ❌ Mouse Right == Delete Option<br>\n        🔍 Ctrl + Wheel == Zoom<br>\n        📱 Mobile support<br>\n        ...</p>\n      </div>\n    </div>\n    ',
              typenode: false,
              inputs: {},
              outputs: {},
              pos_x: 50,
              pos_y: 50
            },
            "2": {
              id: 2,
              name: "slack",
              data: {},
              class: "slack",
              html:
                '\n          <div>\n            <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>\n          </div>\n          ',
              typenode: false,
              inputs: {
                input_1: { connections: [{ node: "7", input: "output_1" }] }
              },
              outputs: {},
              pos_x: 1028,
              pos_y: 87
            },
            "3": {
              id: 3,
              name: "telegram",
              data: { channel: "channel_2" },
              class: "telegram",
              html:
                '\n          <div>\n            <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>\n            <div class="box">\n              <p>Send to telegram</p>\n              <p>select channel</p>\n              <select df-channel>\n                <option value="channel_1">Channel 1</option>\n                <option value="channel_2">Channel 2</option>\n                <option value="channel_3">Channel 3</option>\n                <option value="channel_4">Channel 4</option>\n              </select>\n            </div>\n          </div>\n          ',
              typenode: false,
              inputs: {
                input_1: { connections: [{ node: "7", input: "output_1" }] }
              },
              outputs: {},
              pos_x: 1032,
              pos_y: 184
            },
            "4": {
              id: 4,
              name: "email",
              data: {},
              class: "email",
              html:
                '\n            <div>\n              <div class="title-box"><i class="fas fa-at"></i> Send Email </div>\n            </div>\n            ',
              typenode: false,
              inputs: {
                input_1: { connections: [{ node: "5", input: "output_1" }] }
              },
              outputs: {},
              pos_x: 1033,
              pos_y: 439
            },
            "5": {
              id: 5,
              name: "template",
              data: { template: "Write your template" },
              class: "template",
              html:
                '\n            <div>\n              <div class="title-box"><i class="fas fa-code"></i> Template</div>\n              <div class="box">\n                Ger Vars\n                <textarea df-template></textarea>\n                Output template with vars\n              </div>\n            </div>\n            ',
              typenode: false,
              inputs: {
                input_1: { connections: [{ node: "6", input: "output_1" }] }
              },
              outputs: {
                output_1: {
                  connections: [
                    { node: "4", output: "input_1" },
                    { node: "11", output: "input_1" }
                  ]
                }
              },
              pos_x: 607,
              pos_y: 304
            },
            "6": {
              id: 6,
              name: "github",
              data: { name: "https://github.com/jerosoler/Drawflow" },
              class: "github",
              html:
                '\n          <div>\n            <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>\n            <div class="box">\n              <p>Enter repository url</p>\n            <input type="text" df-name>\n            </div>\n          </div>\n          ',
              typenode: false,
              inputs: {},
              outputs: {
                output_1: { connections: [{ node: "5", output: "input_1" }] }
              },
              pos_x: 341,
              pos_y: 191
            },
            "7": {
              id: 7,
              name: "facebook",
              data: {},
              class: "facebook",
              html:
                '\n        <div>\n          <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>\n        </div>\n        ',
              typenode: false,
              inputs: {},
              outputs: {
                output_1: {
                  connections: [
                    { node: "2", output: "input_1" },
                    { node: "3", output: "input_1" },
                    { node: "11", output: "input_1" }
                  ]
                }
              },
              pos_x: 347,
              pos_y: 87
            },
            "11": {
              id: 11,
              name: "log",
              data: {},
              class: "log",
              html:
                '\n            <div>\n              <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>\n            </div>\n            ',
              typenode: false,
              inputs: {
                input_1: {
                  connections: [
                    { node: "5", input: "output_1" },
                    { node: "7", input: "output_1" }
                  ]
                }
              },
              outputs: {},
              pos_x: 1031,
              pos_y: 363
            }
          }
        },
        Other: {
          data: {
            "8": {
              id: 8,
              name: "personalized",
              data: {},
              class: "personalized",
              html:
                "\n            <div>\n              Personalized\n            </div>\n            ",
              typenode: false,
              inputs: {
                input_1: {
                  connections: [
                    { node: "12", input: "output_1" },
                    { node: "12", input: "output_2" },
                    { node: "12", input: "output_3" },
                    { node: "12", input: "output_4" }
                  ]
                }
              },
              outputs: {
                output_1: { connections: [{ node: "9", output: "input_1" }] }
              },
              pos_x: 764,
              pos_y: 227
            },
            "9": {
              id: 9,
              name: "dbclick",
              data: { name: "Hello World!!" },
              class: "dbclick",
              html:
                '\n            <div>\n            <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>\n              <div class="box dbclickbox" (dblclick)="showpopup(event)">\n                Db Click here\n                <div class="modal" style="display:none">\n                  <div class="modal-content">\n                    <span class="close" (click)="closemodal(event)">&times;</span>\n                    Change your variable {name} !\n                    <input type="text" df-name>\n                  </div>\n\n                </div>\n              </div>\n            </div>\n            ',
              typenode: false,
              inputs: {
                input_1: { connections: [{ node: "8", input: "output_1" }] }
              },
              outputs: {
                output_1: { connections: [{ node: "12", output: "input_2" }] }
              },
              pos_x: 209,
              pos_y: 38
            },
            "12": {
              id: 12,
              name: "multiple",
              data: {},
              class: "multiple",
              html:
                '\n            <div>\n              <div class="box">\n                Multiple!\n              </div>\n            </div>\n            ',
              typenode: false,
              inputs: {
                input_1: { connections: [] },
                input_2: { connections: [{ node: "9", input: "output_1" }] },
                input_3: { connections: [] }
              },
              outputs: {
                output_1: { connections: [{ node: "8", output: "input_1" }] },
                output_2: { connections: [{ node: "8", output: "input_1" }] },
                output_3: { connections: [{ node: "8", output: "input_1" }] },
                output_4: { connections: [{ node: "8", output: "input_1" }] }
              },
              pos_x: 179,
              pos_y: 272
            }
          }
        }
      }
    };
  }
}
