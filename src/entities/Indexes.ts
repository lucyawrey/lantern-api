import { Embeddable, Property } from "@mikro-orm/core";
import type { DataValue } from "types/data";

@Embeddable()
export class Indexes {
  @Property({ index: true })
  index0?: DataValue;
  @Property({ index: true })
  index1?: DataValue;
  @Property({ index: true })
  index2?: DataValue;
  @Property({ index: true })
  index3?: DataValue;
  @Property({ index: true })
  index4?: DataValue;
  @Property({ index: true })
  index5?: DataValue;
  @Property({ index: true })
  index6?: DataValue;
  @Property({ index: true })
  index7?: DataValue;
  @Property({ index: true })
  index8?: DataValue;
  @Property({ index: true })
  index9?: DataValue;
}
