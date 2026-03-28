import{j as e}from"./jsx-runtime-u17CrQMm.js";import{I as g,c as d}from"./index-m2GsfvbU.js";import"./iframe-aZuiXQCe.js";import"./preload-helper-PPVm8Dsz.js";const w={title:"Input",component:g,tags:["autodocs"],decorators:[u=>e.jsx("div",{style:{maxWidth:320,width:"100%"},children:e.jsx(u,{})})],argTypes:{leadingSlot:{control:!1},trailingSlot:{control:!1},status:{control:"select",options:["default","success","warning","error"]}}},a={args:{placeholder:"Placeholder",showLeading:!1,showTrailing:!1}},r={name:"Leading + trailing (placeholders)",args:{placeholder:"Input",showLeading:!0,showTrailing:!0,leadingSlot:e.jsx(d,{}),trailingSlot:e.jsx(d,{})}},s={args:{placeholder:"Disabled",disabled:!0,showLeading:!1,showTrailing:!1}},n={args:{value:"Read-only value",readOnly:!0,showLeading:!1,showTrailing:!1}},o={args:{placeholder:"Success",status:"success",defaultValue:"Valid value",showLeading:!1,showTrailing:!1}},l={args:{placeholder:"Warning",status:"warning",defaultValue:"Check this",showLeading:!1,showTrailing:!1}},t={args:{placeholder:"Error",status:"error",defaultValue:"Invalid",showLeading:!1,showTrailing:!1}},i={name:"aria-invalid (maps to error)",args:{placeholder:"Invalid","aria-invalid":!0,showLeading:!1,showTrailing:!1}},c={name:"contentColor (text + slot icons)",args:{placeholder:"Custom tint",defaultValue:"Hello",contentColor:"var(--color-intent-accent)",showLeading:!0,showTrailing:!0,leadingSlot:e.jsx(d,{}),trailingSlot:e.jsx(d,{})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Placeholder",
    showLeading: false,
    showTrailing: false
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "Leading + trailing (placeholders)",
  args: {
    placeholder: "Input",
    showLeading: true,
    showTrailing: true,
    leadingSlot: <InputSlotPlaceholder />,
    trailingSlot: <InputSlotPlaceholder />
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Disabled",
    disabled: true,
    showLeading: false,
    showTrailing: false
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    value: "Read-only value",
    readOnly: true,
    showLeading: false,
    showTrailing: false
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Success",
    status: "success",
    defaultValue: "Valid value",
    showLeading: false,
    showTrailing: false
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Warning",
    status: "warning",
    defaultValue: "Check this",
    showLeading: false,
    showTrailing: false
  }
}`,...l.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Error",
    status: "error",
    defaultValue: "Invalid",
    showLeading: false,
    showTrailing: false
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "aria-invalid (maps to error)",
  args: {
    placeholder: "Invalid",
    "aria-invalid": true,
    showLeading: false,
    showTrailing: false
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "contentColor (text + slot icons)",
  args: {
    placeholder: "Custom tint",
    defaultValue: "Hello",
    contentColor: "var(--color-intent-accent)",
    showLeading: true,
    showTrailing: true,
    leadingSlot: <InputSlotPlaceholder />,
    trailingSlot: <InputSlotPlaceholder />
  }
}`,...c.parameters?.docs?.source}}};const S=["Default","WithSlots","Disabled","ReadOnly","Success","Warning","Error","AriaInvalid","ContentColor"];export{i as AriaInvalid,c as ContentColor,a as Default,s as Disabled,t as Error,n as ReadOnly,o as Success,l as Warning,r as WithSlots,S as __namedExportsOrder,w as default};
