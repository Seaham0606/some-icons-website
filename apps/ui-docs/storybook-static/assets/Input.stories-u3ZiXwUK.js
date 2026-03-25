import{j as t}from"./jsx-runtime-u17CrQMm.js";import{I as u,a as d}from"./index-DYD40Rep.js";import"./iframe-CBfxnU_t.js";import"./preload-helper-PPVm8Dsz.js";const f={title:"Input",component:u,tags:["autodocs"],decorators:[c=>t.jsx("div",{style:{maxWidth:320,width:"100%"},children:t.jsx(c,{})})],argTypes:{leadingSlot:{control:!1},trailingSlot:{control:!1},status:{control:"select",options:["default","success","warning","error"]}}},a={args:{placeholder:"Placeholder",showLeading:!1,showTrailing:!1}},e={name:"Leading + trailing (placeholders)",args:{placeholder:"Input",showLeading:!0,showTrailing:!0,leadingSlot:t.jsx(d,{}),trailingSlot:t.jsx(d,{})}},r={args:{placeholder:"Disabled",disabled:!0,showLeading:!1,showTrailing:!1}},s={args:{value:"Read-only value",readOnly:!0,showLeading:!1,showTrailing:!1}},n={args:{placeholder:"Success",status:"success",defaultValue:"Valid value",showLeading:!1,showTrailing:!1}},l={args:{placeholder:"Warning",status:"warning",defaultValue:"Check this",showLeading:!1,showTrailing:!1}},o={args:{placeholder:"Error",status:"error",defaultValue:"Invalid",showLeading:!1,showTrailing:!1}},i={name:"aria-invalid (maps to error)",args:{placeholder:"Invalid","aria-invalid":!0,showLeading:!1,showTrailing:!1}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Placeholder",
    showLeading: false,
    showTrailing: false
  }
}`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "Leading + trailing (placeholders)",
  args: {
    placeholder: "Input",
    showLeading: true,
    showTrailing: true,
    leadingSlot: <InputSlotPlaceholder />,
    trailingSlot: <InputSlotPlaceholder />
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Disabled",
    disabled: true,
    showLeading: false,
    showTrailing: false
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    value: "Read-only value",
    readOnly: true,
    showLeading: false,
    showTrailing: false
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Success",
    status: "success",
    defaultValue: "Valid value",
    showLeading: false,
    showTrailing: false
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Warning",
    status: "warning",
    defaultValue: "Check this",
    showLeading: false,
    showTrailing: false
  }
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Error",
    status: "error",
    defaultValue: "Invalid",
    showLeading: false,
    showTrailing: false
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "aria-invalid (maps to error)",
  args: {
    placeholder: "Invalid",
    "aria-invalid": true,
    showLeading: false,
    showTrailing: false
  }
}`,...i.parameters?.docs?.source}}};const w=["Default","WithSlots","Disabled","ReadOnly","Success","Warning","Error","AriaInvalid"];export{i as AriaInvalid,a as Default,r as Disabled,o as Error,s as ReadOnly,n as Success,l as Warning,e as WithSlots,w as __namedExportsOrder,f as default};
