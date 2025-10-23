import Image from "next/image";

export default function NextImage({ children, ...props }) {
  const prefix = process.env.NODE_ENV === "production" ? "/wkd2ev" : "";
  return (
    <Image {...props} src={`${prefix}${props.src}`}>
      {children}
    </Image>
  );
}
