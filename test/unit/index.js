import Vue from "vue";
import $ from "../../dist/vuequery.js";

Vue.component("noop", {
  template: "<i></i>"
});

Vue.component("foo", {
  name: "foo",
  template: "<p>This is foo</p>"
});

Vue.component("bar", {
  name: "bar",
  template: "<div><foo/></div>"
});

Vue.component("baz", {
  name: "baz",
  template: "<div><bar/></div>"
});

Vue.component("qux", {
  name: "qux",
  template: "<div><baz/><noop/><baz/><baz/></div>"
});

describe("VueQuery", () => {
  let $vm;
  beforeEach(() => {
    $vm = $(
      new Vue({
        el: document.createElement("div"),
        template: "<div><qux/></div>"
      }).$mount()
    );
  });

  describe("common", () => {
    it("doesnt init on a VueQuery instance", () => {
      expect($($vm)).to.equal($vm);
    });
  });

  describe("children()", () => {
    it("matches existing children", () => {
      expect($vm.children()).length.to.be(1); // <qux/>
      expect($vm.children()[0].children()).length.to.be(4); // <baz/><noop/><baz/><baz/>
    });

    it("does not match non-existing children", () => {
      expect($vm.children("cuckoo")).to.be.empty;
    });
  });

  describe("find()", () => {
    it("finds direct descendants", () => {
      expect($vm.find("qux")).length.to.be(1);
    });

    it("finds distant descendants", () => {
      expect($vm.find("bar")).length.to.be(3);
    });

    it("doesnt find non-existing name", () => {
      expect($vm.find("cuckoo")).to.be.empty;
    });
  });

  describe("closest()", () => {
    it("finds closest to be self", () => {
      expect(
        $vm
          .find("qux")[0]
          .closest("qux")
          .is("qux")
      ).to.be.true;
    });

    it("finds closest to be parent", () => {
      expect(
        $vm
          .find("foo")[0]
          .closest("bar")
          .is("bar")
      ).to.be.true;
    });

    it("finds closest to be ancestor", () => {
      expect(
        $vm
          .find("foo")[0]
          .closest("qux")
          .is("qux")
      ).to.be.true;
    });

    it("doesnt find invalid closest", () => {
      expect($vm.find("foo")[0].closest("cuckoo")).to.be.null;
    });
  });

  describe("has()", () => {
    it("has direct descendant", () => {
      expect($vm.has("qux")).to.be.true;
    });

    it("has distant descendant", () => {
      expect($vm.has("bar")).to.be.true;
    });

    it("doesnt have invalid descendant", () => {
      expect($vm.has("cuckoo")).to.be.false;
    });
  });

  describe("is()", () => {
    it("is itself", () => {
      expect($vm.is($vm)).to.be.true;
    });

    it("is of a name", () => {
      expect($vm.find("qux")[0].is("qux")).to.be.true;
    });
  });

  describe("next()", () => {
    it("finds next without name", () => {
      expect(
        $vm
          .find("baz")[0]
          .next()
          .is("noop")
      ).to.be.true;
    });

    it("finds next with name", () => {
      expect(
        $vm
          .find("baz")[0]
          .next("noop")
          .is("noop")
      ).to.be.true;
    });

    it("doesnt find next with invalid name", () => {
      expect($vm.find("baz")[0].next("baz")).to.be.null;
    });

    it("doesnt find next at end", () => {
      expect($vm.find("baz")[2].next()).to.be.null;
    });

    it("doesnt find next with invalid name", () => {
      expect($vm.find("baz")[0].next("cuckoo")).to.be.null;
    });
  });

  describe("nextAll()", () => {
    it("finds all next without name", () => {
      const collected = $vm.find("baz")[0].nextAll();
      expect(collected).length.to.be(3);
      expect(collected[0].is("noop")).to.be.true;
      expect(collected[1].is("baz")).to.be.true;
      expect(collected[2].is("baz")).to.be.true;
    });

    it("finds all next with name", () => {
      const collected = $vm.find("baz")[0].nextAll("baz");
      expect(collected).length.to.be(2);
      expect(collected[0].is("baz")).to.be.true;
      expect(collected[1].is("baz")).to.be.true;
    });

    it("doesnt find any next with invalid name", () => {
      const collected = $vm.find("baz")[0].nextAll("cuckoo");
      expect(collected).to.be.empty;
    });
  });

  describe("nextUntil()", () => {
    it("finds all next until", () => {
      const collected = $vm.find("baz")[0].nextUntil("baz");
      expect(collected).length.to.be(1);
      expect(collected[0].is("noop")).to.be.true;
    });

    it("finds no next until", () => {
      expect($vm.find("baz")[0].nextUntil("baz", "baz")).to.be.empty;
    });
  });

  describe("parent()", () => {
    it("finds parent", () => {
      expect(
        $vm
          .find("baz")[0]
          .parent()
          .is("qux")
      );
    });

    it("finds parent with name specified", () => {
      expect(
        $vm
          .find("baz")[0]
          .parent("qux")
          .is("qux")
      ).to.be.true;
    });

    it("doesnt find parent with invalid name specified", () => {
      expect($vm.find("baz")[0].parent("cuckoo")).to.be.null;
    });

    it("doesnt find parent of root", () => {
      expect($vm.parent()).to.be.null;
    });
  });

  describe("parents()", () => {
    it("finds direct parents", () => {
      const parents = $vm.find("foo")[0].parents("bar");
      expect(parents).length.to.be(1);
      expect(parents[0].is("bar")).to.be.true;
    });

    it("finds distant parents", () => {
      const parents = $vm.find("foo")[0].parents("baz");
      expect(parents).length.to.be(1);
      expect(parents[0].is("baz")).to.be.true;
    });

    it("find parents without name specified", () => {
      const parents = $vm.find("foo")[0].parents();
      expect(parents).length.to.be(4);
      expect(parents[0].is("bar")).to.be.true;
      expect(parents[1].is("baz")).to.be.true;
      expect(parents[2].is("qux")).to.be.true;
      expect(parents[3].vm === parents[3].vm.$root).to.be.true;
    });

    it("doesnt find parents with invalid name specified", () => {
      expect($vm.find("baz")[0].parents("cuckoo")).to.be.empty;
    });

    it("doesnt find parents of root", () => {
      expect($vm.parents()).to.be.empty;
    });
  });

  describe("parentsUntil()", () => {
    it("finds parents until", () => {
      const parents = $vm.find("foo")[0].parentsUntil("qux");
      expect(parents).length.to.be(2);
      expect(parents[0].is("bar")).to.be.true;
      expect(parents[1].is("baz")).to.be.true;
    });

    it("doesnt finds parents of root", () => {
      expect($vm.parentsUntil()).to.be.empty;
    });
  });

  describe("prev()", () => {
    it("finds prev without name", () => {
      expect(
        $vm
          .find("baz")[1]
          .prev()
          .is("noop")
      ).to.be.true;
    });

    it("finds prev with name", () => {
      expect(
        $vm
          .find("baz")[1]
          .prev("noop")
          .is("noop")
      ).to.be.true;
    });

    it("doesnt find prev with invalid name", () => {
      expect($vm.find("baz")[1].prev("baz")).to.be.null;
    });

    it("doesnt find prev at beginning", () => {
      expect($vm.find("baz")[0].prev()).to.be.null;
    });

    it("doesnt find prev with invalid name", () => {
      expect($vm.find("baz")[1].prev("cuckoo")).to.be.null;
    });
  });

  describe("prevAll()", () => {
    it("finds all prev without name", () => {
      const collected = $vm.find("baz")[2].prevAll();
      expect(collected).length.to.be(3);
      expect(collected[0].is("baz")).to.be.true;
      expect(collected[1].is("noop")).to.be.true;
      expect(collected[2].is("baz")).to.be.true;
    });

    it("finds all prev with name", () => {
      const collected = $vm.find("baz")[2].prevAll("baz");
      expect(collected).length.to.be(2);
      expect(collected[0].is("baz")).to.be.true;
      expect(collected[1].is("baz")).to.be.true;
    });

    it("doesnt find any prev with invalid name", () => {
      expect($vm.find("baz")[2].prevAll("cuckoo")).to.be.empty;
    });
  });

  describe("prevUntil()", () => {
    it("finds all prev until", () => {
      const collected = $vm.find("baz")[1].prevUntil("baz");
      expect(collected).length.to.be(1);
      expect(collected[0].is("noop")).to.be.true;
    });

    it("finds no prev until", () => {
      expect($vm.find("baz")[1].nextUntil("baz", "baz")).to.be.empty;
    });
  });

  describe("siblings()", () => {
    it("finds all siblings", () => {
      const me = $vm.find("baz")[1];
      const collected = me.siblings();
      expect(collected).length.to.be(3);
      expect(collected).to.not.include(me);
    });
  });
});
