

import { AuthCheck } from "@/components/AuthCheck";
import { FeaturesList } from "./FeaturesList";

export default  function Home() {
  


  return (
    <>
      
      <AuthCheck/>
      <FeaturesList/>
    </>

  );
}
