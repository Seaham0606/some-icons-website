import{C as a,j as e}from"./iframe-2pycKTdO.js";import"./preload-helper-PPVm8Dsz.js";const o={title:"Checkbox",component:a,tags:["autodocs"],args:{defaultChecked:!1,disabled:!1}},r={args:{}},s={args:{children:"Remember me"}},c={args:{defaultChecked:!0,children:"Checked"}},d={args:{disabled:!0,children:"Disabled"}},l={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"row",flexWrap:"wrap",gap:24,alignItems:"center"},children:[e.jsx(a,{"aria-label":"Unchecked"}),e.jsx(a,{defaultChecked:!0,"aria-label":"Checked"}),e.jsx(a,{disabled:!0,"aria-label":"Disabled unchecked"}),e.jsx(a,{defaultChecked:!0,disabled:!0,"aria-label":"Disabled checked"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Remember me"
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: true,
    children: "Checked"
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: "Disabled"
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    alignItems: "center"
  }}>
      <Checkbox aria-label="Unchecked" />
      <Checkbox defaultChecked aria-label="Checked" />
      <Checkbox disabled aria-label="Disabled unchecked" />
      <Checkbox defaultChecked disabled aria-label="Disabled checked" />
    </div>
}`,...l.parameters?.docs?.source}}};const i=["Default","WithLabel","Checked","Disabled","Row"];export{c as Checked,r as Default,d as Disabled,l as Row,s as WithLabel,i as __namedExportsOrder,o as default};
