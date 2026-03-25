import{j as r}from"./jsx-runtime-u17CrQMm.js";import{B as e}from"./index-DYD40Rep.js";import"./iframe-CBfxnU_t.js";import"./preload-helper-PPVm8Dsz.js";function v(){return r.jsx("svg",{width:16,height:16,viewBox:"0 0 24 24","aria-hidden":!0,children:r.jsx("circle",{cx:"12",cy:"12",r:"6",fill:"currentColor"})})}function h(){return r.jsx("svg",{width:16,height:16,viewBox:"0 0 24 24","aria-hidden":!0,children:r.jsx("path",{fill:"currentColor",d:"M9 6l6 6-6 6V6z"})})}const z={title:"Button",component:e,tags:["autodocs"],argTypes:{children:{control:"text",table:{category:"Content"}},leadingSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},trailingSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},contentColor:{table:{category:"Appearance"}},variant:{control:"select",options:["primary","secondary","tertiary","transparent"],table:{category:"Appearance"}},tint:{control:"select",options:["default","inverse"],table:{category:"Appearance"}},size:{control:"select",options:["lg","md","sm"],table:{category:"Appearance"}},radius:{control:"select",options:["none","xs","sm","md","lg","xl","2xl","3xl","full"],table:{category:"Appearance"}},fullWidth:{control:"boolean",table:{category:"Layout"}},href:{table:{category:"Link"}},target:{table:{category:"Link"}},rel:{table:{category:"Link"}},download:{table:{category:"Link"}}}},a={args:{children:"Button",variant:"primary",size:"lg"}},n={name:"With leading & trailing slots",args:{children:"Button",variant:"primary",size:"md",leadingSlot:r.jsx(v,{}),trailingSlot:r.jsx(h,{})}},t={args:{children:"Button",variant:"secondary",size:"lg"}},s={args:{children:"Button",variant:"tertiary",size:"lg"}},o={args:{children:"Button",variant:"transparent",size:"lg"}},i={args:{children:"Button",variant:"primary",tint:"inverse",size:"lg"},decorators:[u=>r.jsx("div",{style:{padding:24,background:"var(--color-gray-900)",borderRadius:8},children:r.jsx(u,{})})]},c={render:()=>r.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[r.jsx(e,{size:"lg",children:"Large"}),r.jsx(e,{size:"md",children:"Medium"}),r.jsx(e,{size:"sm",children:"Small"})]})},l={args:{children:"Docs",href:"https://example.com",target:"_blank",rel:"noopener noreferrer",variant:"transparent"}},d={args:{children:"Accent",variant:"tertiary",contentColor:"var(--color-intent-accent)"}},p={args:{children:"Pill",variant:"primary",radius:"full"}},m={args:{children:"Disabled",variant:"primary",disabled:!0}},g={render:()=>{const u=["primary","secondary","tertiary","transparent"];return r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, auto)",gap:12,alignItems:"center"},children:u.map(y=>r.jsx(e,{variant:y,size:"md",children:y},y))})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "primary",
    size: "lg"
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "With leading & trailing slots",
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    leadingSlot: <DemoDot />,
    trailingSlot: <DemoChevron />
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "secondary",
    size: "lg"
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "tertiary",
    size: "lg"
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "transparent",
    size: "lg"
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "primary",
    tint: "inverse",
    size: "lg"
  },
  decorators: [StoryEl => <div style={{
    padding: 24,
    background: "var(--color-gray-900)",
    borderRadius: 8
  }}>
        <StoryEl />
      </div>]
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 12,
    alignItems: "center"
  }}>
      <Button size="lg">Large</Button>
      <Button size="md">Medium</Button>
      <Button size="sm">Small</Button>
    </div>
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Docs",
    href: "https://example.com",
    target: "_blank",
    rel: "noopener noreferrer",
    variant: "transparent"
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Accent",
    variant: "tertiary",
    contentColor: "var(--color-intent-accent)"
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Pill",
    variant: "primary",
    radius: "full"
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Disabled",
    variant: "primary",
    disabled: true
  }
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const variants = ["primary", "secondary", "tertiary", "transparent"] as const;
    return <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, auto)",
      gap: 12,
      alignItems: "center"
    }}>
        {variants.map(v => <Button key={v} variant={v} size="md">
            {v}
          </Button>)}
      </div>;
  }
}`,...g.parameters?.docs?.source}}};const f=["Primary","WithLeadingAndTrailingSlots","Secondary","Tertiary","Transparent","PrimaryInverse","Sizes","AsLink","ContentColor","RadiusFull","Disabled","Matrix"];export{l as AsLink,d as ContentColor,m as Disabled,g as Matrix,a as Primary,i as PrimaryInverse,p as RadiusFull,t as Secondary,c as Sizes,s as Tertiary,o as Transparent,n as WithLeadingAndTrailingSlots,f as __namedExportsOrder,z as default};
