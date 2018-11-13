/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// to make it available all over app
declare var Stripe: any;
