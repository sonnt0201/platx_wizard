import { AuthCheck } from "@/components/AuthCheck";
import { FeaturesList } from "./FeaturesList";

export default async function Home() {
  


  return (
    <>
      <h1>Hello from services</h1>
      <AuthCheck/>
      <FeaturesList/>
    </>

  );
}
