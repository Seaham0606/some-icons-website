import{j as r}from"./index-ytRKo10x.js";import{r as b}from"./iframe-asEztNxr.js";import{B as t}from"./index-CAnsHohd.js";import"./index-D1OtZOqg.js";import"./preload-helper-PPVm8Dsz.js";const S=[{iconName:"weather-moon",iconStyle:"fill"},{iconName:"weather-sun",iconStyle:"outline"}];function A(){return r.jsx("svg",{width:16,height:16,viewBox:"0 0 24 24","aria-hidden":!0,children:r.jsx("circle",{cx:"12",cy:"12",r:"6",fill:"currentColor"})})}function z(){return r.jsx("svg",{width:16,height:16,viewBox:"0 0 24 24","aria-hidden":!0,children:r.jsx("path",{fill:"currentColor",d:"M9 6l6 6-6 6V6z"})})}const D={title:"Button",component:t,tags:["autodocs"],argTypes:{children:{control:"text",table:{category:"Content"}},leadingSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},trailingSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},contentColor:{table:{category:"Appearance"}},variant:{control:"select",options:["primary","secondary","tertiary","transparent"],table:{category:"Appearance"}},tint:{control:"select",options:["default","inverse"],table:{category:"Appearance"}},size:{control:"select",options:["lg","md","sm"],table:{category:"Appearance"}},radius:{control:"select",options:["none","xs","sm","md","lg","xl","2xl","3xl","full"],table:{category:"Appearance"}},fullWidth:{control:"boolean",table:{category:"Layout"}},href:{table:{category:"Link"}},target:{table:{category:"Link"}},rel:{table:{category:"Link"}},download:{table:{category:"Link"}},stateIcons:{control:!1,table:{category:"Icon strip"}},stripActiveIndex:{control:"select",options:[0,1],table:{category:"Icon strip"}},stripPlacement:{control:"select",options:["start","end"],table:{category:"Icon strip"}},hasFeedback:{table:{category:"Icon strip"}},respectReducedMotion:{table:{category:"Icon strip"}},stripIconSize:{table:{category:"Icon strip"}}}},a={args:{children:"Button",variant:"primary",size:"lg"}},o={name:"With leading & trailing slots",args:{children:"Button",variant:"primary",size:"md",leadingSlot:r.jsx(A,{}),trailingSlot:r.jsx(z,{})}},s={args:{children:"Button",variant:"secondary",size:"lg"}},i={args:{children:"Button",variant:"tertiary",size:"lg"}},c={args:{children:"Button",variant:"transparent",size:"lg"}},l={args:{children:"Button",variant:"primary",tint:"inverse",size:"lg"},decorators:[n=>r.jsx("div",{style:{padding:24,background:"var(--color-gray-900)",borderRadius:8},children:r.jsx(n,{})})]},d={render:()=>r.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[r.jsx(t,{size:"lg",children:"Large"}),r.jsx(t,{size:"md",children:"Medium"}),r.jsx(t,{size:"sm",children:"Small"})]})},p={args:{children:"Docs",href:"https://example.com",target:"_blank",rel:"noopener noreferrer",variant:"transparent"}},m={args:{children:"Accent",variant:"tertiary",contentColor:"var(--color-intent-accent)"}},u={args:{children:"Pill",variant:"primary",radius:"full"}},g={args:{children:"Disabled",variant:"primary",disabled:!0}},y={name:"With animated icon strip",args:{type:"button",variant:"transparent",size:"md",radius:"lg","aria-label":"Demo strip",stateIcons:S,stripActiveIndex:0,contentColor:"var(--color-main-tertiary)"}},v={name:"Animated icon strip (interactive)",render:function(){const[e,x]=b.useState(0);return r.jsx(t,{type:"button",variant:"transparent",size:"md",radius:"lg","aria-label":e===0?"Show second":"Show first",onClick:()=>x(I=>I===0?1:0),stateIcons:S,stripActiveIndex:e,contentColor:"var(--color-main-tertiary)"})}},h={render:()=>{const n=["primary","secondary","tertiary","transparent"];return r.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(4, auto)",gap:12,alignItems:"center"},children:n.map(e=>r.jsx(t,{variant:e,size:"md",children:e},e))})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "primary",
    size: "lg"
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "With leading & trailing slots",
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    leadingSlot: <DemoDot />,
    trailingSlot: <DemoChevron />
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "secondary",
    size: "lg"
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "tertiary",
    size: "lg"
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "transparent",
    size: "lg"
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 12,
    alignItems: "center"
  }}>
      <Button size="lg">Large</Button>
      <Button size="md">Medium</Button>
      <Button size="sm">Small</Button>
    </div>
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Docs",
    href: "https://example.com",
    target: "_blank",
    rel: "noopener noreferrer",
    variant: "transparent"
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Accent",
    variant: "tertiary",
    contentColor: "var(--color-intent-accent)"
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Pill",
    variant: "primary",
    radius: "full"
  }
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Disabled",
    variant: "primary",
    disabled: true
  }
}`,...g.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "With animated icon strip",
  args: {
    type: "button",
    variant: "transparent",
    size: "md",
    radius: "lg",
    "aria-label": "Demo strip",
    stateIcons: demoStripIcons,
    stripActiveIndex: 0,
    contentColor: "var(--color-main-tertiary)"
  }
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Animated icon strip (interactive)",
  render: function AnimatedIconStripInteractiveRender() {
    const [stripActiveIndex, setStripActiveIndex] = useState<0 | 1>(0);
    return <Button type="button" variant="transparent" size="md" radius="lg" aria-label={stripActiveIndex === 0 ? "Show second" : "Show first"} onClick={() => setStripActiveIndex(i => i === 0 ? 1 : 0)} stateIcons={demoStripIcons} stripActiveIndex={stripActiveIndex} contentColor="var(--color-main-tertiary)" />;
  }
}`,...v.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}};const w=["Primary","WithLeadingAndTrailingSlots","Secondary","Tertiary","Transparent","PrimaryInverse","Sizes","AsLink","ContentColor","RadiusFull","Disabled","WithAnimatedIconStrip","AnimatedIconStripInteractive","Matrix"];export{v as AnimatedIconStripInteractive,p as AsLink,m as ContentColor,g as Disabled,h as Matrix,a as Primary,l as PrimaryInverse,u as RadiusFull,s as Secondary,d as Sizes,i as Tertiary,c as Transparent,y as WithAnimatedIconStrip,o as WithLeadingAndTrailingSlots,w as __namedExportsOrder,D as default};
